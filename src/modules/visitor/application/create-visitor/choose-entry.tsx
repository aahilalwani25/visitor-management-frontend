// pages/choose-entry-method/[user_id].tsx

import { useRouter } from 'next/router';
const ChooseEntryMethod = () => {
  const router = useRouter();
  const { user_id } = router.query;

  const handleManual = () => {
    router.push(`/create-visitor/${user_id}`);
  };

  const handleScan = () => {
    router.push(`/scan-id/${user_id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h2 className="text-xl font-semibold mb-4">How would you like to proceed?</h2>
      <button onClick={handleManual} className="px-6 py-3 bg-blue-500 text-white rounded-md">
        Enter Manually
      </button>
      <button onClick={handleScan} className="px-6 py-3 bg-green-500 text-white rounded-md">
        Scan ID
      </button>
    </div>
  );
};

export default ChooseEntryMethod;
