"use client";
import BulkUploadForm from '../../components/BulkUploadForm';
import { useRouter } from 'next/navigation';

export default function BulkUploadPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bulk Upload Questions</h1>
      <BulkUploadForm onClose={() => router.push('/')} />
    </div>
  );
} 