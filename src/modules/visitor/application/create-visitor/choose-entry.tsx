"use client";

import { useParams, useRouter } from "next/navigation";
import { Scan_Type } from "../../domain/checkin.types";

export default function ChooseEntryMethod() {
  const router = useRouter();
  const params = useParams(); // This will give you an object like { visitor_id: 'abc123' }

  const visitor_id = params.visitor_id as string;

  const handleManual = () => {
    router.push(`/create-visitor/${visitor_id}`);
  };

  const handleScan = (type: Scan_Type) => {
    router.push(`/scan-id/${visitor_id}?type=${type}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h2 className="text-xl font-semibold">How would you like to proceed?</h2>
      <div className="flex gap-4">
        <button
          onClick={handleManual}
          className="px-6 py-3 bg-blue-500 text-white rounded-md cursor-pointer"
        >
          Enter Manually
        </button>
        <button
          onClick={() => handleScan(Scan_Type.CNIC)}
          className="px-6 py-3 bg-blue-500 text-white rounded-md cursor-pointer"
        >
          Scan ID
        </button>
      </div>
    </div>
  );
}
