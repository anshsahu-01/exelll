import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

type Params = Promise<{ id: string }>;

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const { id } = await params;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link href="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold mt-4">Product Detail</h1>
      <p className="text-gray-500 mt-2">Product ID: {id}</p>
      <p className="text-gray-400 mt-4">Full product detail page will be implemented in Module 3.</p>
    </div>
  );
}
