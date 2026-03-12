"use client";
import MeetContainer from "@/modules/meet/application/meet.container";
import { useParams } from "next/navigation";
import React from "react";

function Page() {
  const params = useParams();
  console.log(params);
  return <MeetContainer visitor_id={params?.visitor_id?.toString()!}/>;
}

export default Page;
