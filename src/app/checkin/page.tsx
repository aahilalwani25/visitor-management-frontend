'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
const CheckinSuccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get('message') || 'Visitor';
  const type = searchParams.get('type') || 'checkin';
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/'); // :arrow_left: or navigate somewhere else
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">
        {message} 
      </h1>
      <p className="text-lg">You’ll be redirected shortly...</p>
    </div>
  );
};
export default CheckinSuccess;