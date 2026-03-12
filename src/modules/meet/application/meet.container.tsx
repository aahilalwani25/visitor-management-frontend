"use client";
import React from "react";
import MeetView from "./meet.view";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { outputs } from "@/config/output";
import { CreateMeetFormData, CreateMeetSuccess } from "../domain/meet";

interface Props {
  visitor_id: string;
}
function MeetContainer({ ...props }: Props) {
  const router = useRouter();
  const { register, handleSubmit } = useForm<CreateMeetFormData>();

  const onSubmitMeet = (
    data: CreateMeetFormData,
  ): Promise<CreateMeetSuccess> => {
    console.log(data.company_name);
    return outputs.meetOutput.createMeet({
      user_id: props?.visitor_id,
      company_name: data?.company_name,
      person_email: data?.person_email,
    });
  };

  const { mutate: onSubmit, isPending } = useMutation({
    mutationKey: ["submit-meet"],
    mutationFn: onSubmitMeet,
    onSuccess: (data) => {
      alert(data?.message);
      router.push("/");
    },
    onError: (e) => {
      alert(JSON.stringify(e));
    },
  });

  return (
    <MeetView
      user_id={props?.visitor_id?.toString()}
      isPending={isPending}
      onSubmit={onSubmit}
      register={register}
      handleSubmit={handleSubmit}
    />
  );
}

export default MeetContainer;
