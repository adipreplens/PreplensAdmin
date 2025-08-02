# PrepLens Admin Panel

A modern, comprehensive admin panel for managing questions and content for the PrepLens EdTech platform. This admin panel allows content managers to upload, edit, and manage questions for various government job exams.

## 🎯 Features

### 📊 Dashboard Overview
- **Statistics Dashboard**: View total questions, published vs draft counts
- **Subject Distribution**: See question distribution across subjects
- **Exam-wise Analytics**: Track questions by exam type
- **Quick Actions**: Easy access to common tasks

### 📝 Question Upload System
- **Rich Text Editor**: Full-featured editor with LaTeX support for mathematical formulas
- **Multiple Choice Options**: Easy A, B, C, D option management
- **Detailed Solutions**: Step-by-step solution editor with LaTeX support
- **Preview Mode**: Toggle between edit and preview modes
- **Comprehensive Tagging**: Subject, difficulty, category, topic, and exam mapping

### 🏷️ Question Metadata
- **Difficulty Levels**: Basic, Intermediate, Advanced, Expert
- **Categories**: Conceptual, Application, Learning, Analytical
- **Subjects**: Quantitative Aptitude, Reasoning, English, GK, Computer Knowledge, Current Affairs
- **Exam Mapping**: RRB JE, RRB ALP, RRB Technician, RRB NTPC, SSC CGL, SSC CHSL, SSC JE
- **Time Limits**: Configurable time limits (10-300 seconds)
- **Publish Control**: Draft or publish immediately

### 🔍 Question Management
- **Advanced Filtering**: Filter by subject, difficulty, category, status, and exam types
- **Search Functionality**: Search through question text
- **Bulk Operations**: View and manage multiple questions
- **Status Tracking**: Published vs Draft status

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Rich Text Editor**: React Quill with LaTeX support
- **Form Management**: React Hook Form
- **Icons**: Heroicons
- **State Management**: React hooks and Zustand

## 📁 Project Structure

```
preplens-admin/
├── app/
│   ├── globals.css          # Global styles and Tailwind config
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main admin dashboard
├── components/
│   ├── QuestionUploadForm.tsx    # Question upload form with rich editor
│   ├── QuestionList.tsx          # Question management and filtering
│   └── StatsOverview.tsx         # Dashboard statistics
├── types/
│   └── index.ts             # TypeScript type definitions
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:3000`

## 📋 Usage Guide

### 1. Dashboard Overview
- View key metrics and statistics
- Monitor question distribution
- Access quick actions

### 2. Uploading Questions

#### Step 1: Question Text
- Use the rich text editor for question content
- Support for LaTeX formulas: `\frac{a}{b} + \frac{c}{d}`
- Preview mode to see final formatting

#### Step 2: Multiple Choice Options
- Enter options A, B, C, D
- Mark the correct answer
- Rich text support for options

#### Step 3: Detailed Solution
- Step-by-step solution editor
- LaTeX support for mathematical expressions
- Clear explanations for students

#### Step 4: Metadata Tagging
- **Time Limit**: Set question time (10-300 seconds)
- **Difficulty**: Basic, Intermediate, Advanced, Expert
- **Category**: Conceptual, Application, Learning, Analytical
- **Subject**: Choose from available subjects
- **Topic**: Specific topic (e.g., "Percentages", "Time & Work")
- **Exam Mapping**: Select applicable exams
- **Publish Status**: Draft or publish immediately

### 3. Managing Questions

#### Filtering Options
- **Search**: Text search in question content
- **Subject Filter**: Filter by specific subjects
- **Difficulty Filter**: Filter by difficulty level
- **Category Filter**: Filter by question category
- **Status Filter**: Published vs Draft
- **Exam Filter**: Filter by exam types

#### Question Actions
- **View**: Preview question formatting
- **Edit**: Modify question content and metadata
- **Delete**: Remove questions from the system

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) - Main actions and branding
- **Success**: Green (#22C55E) - Published status, positive actions
- **Warning**: Yellow (#F59E0B) - Draft status, caution states
- **Danger**: Red (#EF4444) - Delete actions, errors

### Components
- **Cards**: Clean, bordered containers for content sections
- **Buttons**: Consistent button styles with hover states
- **Forms**: Styled input fields with focus states
- **Badges**: Status and category indicators

## 🔧 Configuration

### Adding New Subjects
Edit `types/index.ts`:
```typescript
export type Subject = 
  | 'Quantitative Aptitude'
  | 'Reasoning'
  | 'English'
  | 'General Knowledge'
  | 'Computer Knowledge'
  | 'Current Affairs'
  | 'Your New Subject'; // Add here
```

### Adding New Exam Types
Edit `types/index.ts`:
```typescript
export type ExamType = 
  | 'RRB JE'
  | 'RRB ALP'
  | 'RRB Technician'
  | 'RRB NTPC'
  | 'SSC CGL'
  | 'SSC CHSL'
  | 'SSC JE'
  | 'Your New Exam'; // Add here
```

## 📊 Data Structure

### Question Object
```typescript
interface Question {
  id: string;
  questionText: string;
  options: QuestionOption[];
  correctAnswer: string;
  detailedSolution: string;
  timeLimit: number;
  difficultyLevel: DifficultyLevel;
  category: QuestionCategory;
  subject: Subject;
  topic: string;
  examMapping: ExamType[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
Create `.env.local` for environment-specific configuration:
```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_APP_NAME=PrepLens Admin
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**PrepLens Admin Panel** - Empowering content managers to create exceptional learning experiences for government job aspirants. # Force Vercel to build latest version
# Force Vercel to rebuild with clean cache
