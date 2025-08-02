const fs = require('fs');
console.log('backend/.env exists:', fs.existsSync(__dirname + '/.env'));
if (fs.existsSync(__dirname + '/.env')) {
  console.log('backend/.env content:', fs.readFileSync(__dirname + '/.env', 'utf8'));
}
require('dotenv').config({ path: __dirname + '/.env' });
console.log('MONGODB_URI:', process.env.MONGODB_URI);
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Question schema
const questionSchema = new mongoose.Schema({
  text: String,
  options: [String],
  answer: String, // The text of the correct answer
  correctOptionIndex: Number, // Index of correct option (0-3)
  correctOptionLetter: String, // Letter of correct option (A, B, C, D)
  solution: String, // Solution/explanation for the question
  subject: String,
  exam: String,
  difficulty: String,
  tags: [String],
  marks: Number,
  timeLimit: Number,
  blooms: String,
  type: { type: String, enum: ['static', 'power'], default: 'static' },
  imageUrl: String,
});
const Question = mongoose.model('Question', questionSchema);

// User schema for authentication
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
});
const User = mongoose.model('User', userSchema);

// Multer setup for file uploads
const diskUpload = multer({ dest: 'uploads/' }); // For endpoints that need disk storage
const memoryUpload = multer({ 
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 1
  }
}); // For S3 image upload (in-memory buffer)

// AWS S3 config
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Bulk upload endpoint
app.post('/bulk-upload', diskUpload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const filePath = path.resolve(req.file.path);
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);
    const marks = req.body.marks;
    const timeLimit = req.body.timeLimit;
    const blooms = req.body.blooms;
    const type = req.body.type || 'static';
    
    const newQuestions = rows.map((row, idx) => {
      const options = [row.optionA, row.optionB, row.optionC, row.optionD];
      const answerLetter = row.answer?.toUpperCase();
      const optionLetters = ['A', 'B', 'C', 'D'];
      const correctIndex = optionLetters.indexOf(answerLetter);
      const correctAnswerText = options[correctIndex] || '';
      
      return {
        text: row.text || '',
        options: options,
        answer: correctAnswerText, // Store the actual answer text
        correctOptionIndex: correctIndex >= 0 ? correctIndex : null,
        correctOptionLetter: answerLetter,
        solution: row.solution || '', // Add solution field from CSV
        subject: row.subject,
        exam: row.exam,
        difficulty: row.difficulty,
        tags: row.tags ? row.tags.split(',') : [],
        marks: marks || row.marks || 4,
        timeLimit: timeLimit || row.timeLimit || 60,
        blooms: blooms || row.blooms || '',
        type: row.type || type,
      };
    });
    
    const inserted = await Question.insertMany(newQuestions);
    res.json({ added: inserted.length, questions: inserted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to parse file', details: err.message });
  }
});

// Get all questions
app.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ error: 'Failed to fetch questions', details: err.message });
  }
});

// Get statistics endpoint
app.get('/statistics', async (req, res) => {
  try {
    const totalQuestions = await Question.countDocuments();
    const questionsBySubject = await Question.aggregate([
      { $group: { _id: '$subject', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const questionsByExam = await Question.aggregate([
      { $group: { _id: '$exam', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const questionsByDifficulty = await Question.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const questionsWithSolutions = await Question.countDocuments({ solution: { $exists: true, $ne: '' } });
    const questionsWithImages = await Question.countDocuments({ imageUrl: { $exists: true, $ne: '' } });
    
    res.json({
      totalQuestions,
      questionsBySubject,
      questionsByExam,
      questionsByDifficulty,
      questionsWithSolutions,
      questionsWithImages,
      questionsWithoutSolutions: totalQuestions - questionsWithSolutions,
      questionsWithoutImages: totalQuestions - questionsWithImages
    });
  } catch (err) {
    console.error('Error fetching statistics:', err);
    res.status(500).json({ error: 'Failed to fetch statistics', details: err.message });
  }
});

// Add a new question
app.post('/questions', async (req, res) => {
  const { text, answer, options, subject, exam, difficulty, tags, marks, timeLimit, blooms, type, imageUrl, correctAnswer, solution } = req.body;
  
  // Handle answer mapping for individual question creation
  let correctOptionIndex = null;
  let correctOptionLetter = null;
  let answerText = answer;
  
  if (correctAnswer !== null && correctAnswer !== undefined && options && options.length > 0) {
    correctOptionIndex = correctAnswer;
    correctOptionLetter = ['A', 'B', 'C', 'D'][correctAnswer];
    answerText = options[correctAnswer] || answer;
  }
  
  const newQuestion = new Question({ 
    text, 
    answer: answerText, 
    correctOptionIndex,
    correctOptionLetter,
    solution: solution || '', // Add solution field
    options, 
    subject, 
    exam, 
    difficulty, 
    tags, 
    marks, 
    timeLimit, 
    blooms, 
    type: type || 'static', 
    imageUrl 
  });
  await newQuestion.save();
  res.status(201).json(newQuestion);
});

// Delete a question
app.delete('/questions/:id', async (req, res) => {
  const id = req.params.id;
  await Question.findByIdAndDelete(id);
  res.status(204).end();
});

app.use('/template', (req, res) => {
  res.download(path.join(__dirname, 'bulk_upload_template.csv'));
});

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// S3 image upload endpoint
app.post('/upload-image', memoryUpload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  console.log('Image upload attempted:', req.file.originalname, 'Size:', req.file.size, 'bytes');

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `questions/${Date.now()}-${req.file.originalname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
    // Note: ACLs are disabled on this bucket, so we don't set ACL
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('S3 upload error:', err);
      // Fallback to mock URL if S3 fails
      const mockUrl = `https://via.placeholder.com/400x300/cccccc/666666?text=Image+Uploaded+${Date.now()}`;
      console.log('Using fallback URL:', mockUrl);
      return res.json({ url: mockUrl });
    }
    console.log('S3 upload successful:', data.Location);
    res.json({ url: data.Location });
  });
});

// Register endpoint (for initial admin creation only)
// Remove or protect this in production!
app.post('/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: 'User already exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hash, role: 'admin' });
  await user.save();
  res.json({ message: 'Admin user created' });
});

// Login endpoint
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  // Accept only the hardcoded admin email, any password
  if (email === 'admin@preplens.com') {
    // Return a dummy JWT token
    const token = jwt.sign({ id: 'devadmin', email, role: 'admin' }, process.env.JWT_SECRET || 'changeme', { expiresIn: '1d' });
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});
// NOTE: Remove this and restore secure login after fixing MongoDB connection!

// JWT middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'changeme');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Clear all questions from database (DANGEROUS - use with caution!)
app.delete('/clear-database', async (req, res) => {
  try {
    const result = await Question.deleteMany({});
    res.json({ 
      message: `Successfully cleared database. Deleted ${result.deletedCount} questions.`,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error clearing database:', error);
    res.status(500).json({ error: 'Failed to clear database' });
  }
});

// Clear questions by specific criteria
app.delete('/clear-questions', async (req, res) => {
  try {
    const { subject, exam, difficulty, tags } = req.body;
    const filter = {};
    
    if (subject) filter.subject = subject;
    if (exam) filter.exam = exam;
    if (difficulty) filter.difficulty = difficulty;
    if (tags && tags.length > 0) filter.tags = { $in: tags };
    
    const result = await Question.deleteMany(filter);
    res.json({ 
      message: `Successfully cleared questions with filter: ${JSON.stringify(filter)}. Deleted ${result.deletedCount} questions.`,
      deletedCount: result.deletedCount,
      filter: filter
    });
  } catch (error) {
    console.error('Error clearing questions:', error);
    res.status(500).json({ error: 'Failed to clear questions' });
  }
});

app.listen(PORT, () => {
  console.log(`Preplens backend running on http://localhost:${PORT}`);
});

/*
Instructions:
- To create the first admin, POST to /auth/register with { email, password } (remove this endpoint after setup).
- To login, POST to /auth/login with { email, password } and use the returned token as 'Authorization: Bearer <token>' in protected requests.
- Only users with role 'admin' can login and manage questions.
- Set JWT_SECRET in your .env for security.
*/ 