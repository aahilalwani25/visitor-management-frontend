"use client";
import React from 'react'
import CreateVisitorView from './create-visitor.view'
import { useMutation } from '@tanstack/react-query';
import { outputs } from '@/config/output';
import {useForm} from 'react-hook-form'
import { CreateUserFormData } from '../../visitor';
import { useParams, useSearchParams ,useRouter } from 'next/navigation';


function CreateVisitorContainer() {
    const params = useParams();
    console.log(params)
    const router = useRouter();

    const { register, handleSubmit }= useForm<CreateUserFormData>()
    
    const onCreateUser = (data: CreateUserFormData): Promise<CreateUserSuccess> => {
        return outputs.checkinOutput.createVisitor(data);
    };

    const { mutate: onSubmit, } = useMutation({
        mutationKey: ['create-visitor'],
        mutationFn: onCreateUser,
        onSuccess: (data) => {
            alert(data?.message);
            router.push('/');
            
        },
        onError: (e) => {
            alert(e.message)
        }
    });

    return (
        <CreateVisitorView user_id={params?.visitor_id?.toString()} onSubmit={onSubmit} register={register} handleSubmit={handleSubmit}/>
    )
}

export default CreateVisitorContainer
