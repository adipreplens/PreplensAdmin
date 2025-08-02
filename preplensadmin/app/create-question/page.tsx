"use client";
import CreateQuestionForm from '../../components/CreateQuestionForm';
import { useRouter } from 'next/navigation';

export default function CreateQuestionPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Question</h1>
      <CreateQuestionForm onSuccess={() => router.push('/')} />
    </div>
  );
}