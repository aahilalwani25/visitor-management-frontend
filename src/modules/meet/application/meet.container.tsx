"use client";
import React from 'react'
import MeetView from './meet.view'
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { outputs } from '@/config/output';
import { CreateMeetFormData, CreateMeetSuccess } from '../domain/meet';

function MeetContainer() {
    const params = useParams();
    const router = useRouter();

    const { register, handleSubmit } = useForm<CreateMeetFormData>()

    const onSubmitMeet = (data: CreateMeetFormData): Promise<CreateMeetSuccess> => {
        return outputs.meetOutput.createMeet(data);
    };

    const { mutate: onSubmit, } = useMutation({
        mutationKey: ['submit-meet'],
        mutationFn: onSubmitMeet,
        onSuccess: (data) => {
            alert(data?.message);
            router.push('/');

        },
        onError: (e) => {
            alert(e.message)
        }
    });

    return (
        <MeetView
            user_id={params?.visitor_id?.toString()}
            onSubmit={onSubmit} 
            register={register}
            handleSubmit={handleSubmit}
        />
    )
}

export default MeetContainer
