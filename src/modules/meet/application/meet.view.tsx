import Input from '@/components/ui/input'
import Image from 'next/image'
import { UseMutateFunction } from '@tanstack/react-query'
import React from 'react'
import { FieldValues, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { CreateMeetFormData, CreateMeetSuccess } from '../domain/meet'

interface Props {
    register: UseFormRegister<CreateMeetFormData>;
    handleSubmit: UseFormHandleSubmit<CreateMeetFormData>;
    onSubmit: UseMutateFunction<CreateMeetSuccess, Error, CreateMeetFormData, unknown>;
    user_id: string | undefined;
}

function MeetView({ ...props }: Props) {
    return (
        <div className='min-h-screen bg-white items-center justify-center flex'>

            <form
                onSubmit={props.handleSubmit((data) => props.onSubmit(data))}
                className="p-8 rounded-lg shadow-md w-full max-w-md space-y-6"
            >
                <h2 className="text-2xl font-bold text-center text-black">Meeting</h2>

                <div>
                    <label className="block mb-1 text-sm font-medium text-black">With whom do you want to meet?</label>
                    <Input
                        // register={props.register}
                        key="meet_person"
                        placeholder='Meet Person'
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-black">Your Company Name</label>
                    <Input
                        // register={props.register}
                        key="company_name"
                        placeholder='Company Name'
                    />
                </div>

                {/* Hidden inputs */}
                {/* <input {...props.register("check_in")} value={new Date().toISOString()} className="hidden" />
                <input {...props.register("user_id")} value={props.user_id} className="hidden" /> */}

                <button
                    type="submit"
                    className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-purple-700 transition"
                >
                    Submit Meet
                </button>
            </form>
        </div>
    )
}

export default MeetView
