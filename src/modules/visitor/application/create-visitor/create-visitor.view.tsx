import { UseMutateFunction } from '@tanstack/react-query'
import React from 'react'
import { FieldValues, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { CreateUserFormData } from '../../visitor';

interface Props {
    register: UseFormRegister<CreateUserFormData>;
    handleSubmit: UseFormHandleSubmit<CreateUserFormData>;
    onSubmit: UseMutateFunction<CreateUserSuccess, Error, CreateUserFormData, unknown>;
    user_id: string|undefined
}

function CreateVisitorView({...props}: Props) {
    return (
        <form onSubmit={props.handleSubmit((data)=>props.onSubmit(data))} className='flex flex-col gap-5'>
            <h1>Create Visitor</h1>
            <input {...props.register("cnic", { required: true, maxLength: 20 })} className='border border-white h-8 w-60 rounded' placeholder='Enter Cnic' />
            <input {...props.register("full_name", { required: true, maxLength: 20 })} className='border border-white h-8 w-60 rounded' placeholder='Enter Name' />
            <input {...props.register("check_in")} value={new Date().toISOString()} className='hidden'/>
            <input {...props.register("user_id")} value={props.user_id} className='hidden'/>
            <div className="mt-4 space-x-2">
                <button type='submit' className="px-4 py-2 bg-purple-500 text-white rounded">
                    Create
                </button>
            </div>
        </form>
    )
}

export default CreateVisitorView
