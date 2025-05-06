import { UseMutateFunction } from '@tanstack/react-query'
import React from 'react'
import { FieldValues, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { CreateUserFormData } from '../../visitor';

interface Props {
    register: UseFormRegister<CreateUserFormData>;
    handleSubmit: UseFormHandleSubmit<CreateUserFormData>;
    onSubmit: UseMutateFunction<CreateUserSuccess, Error, CreateUserFormData, unknown>;
    user_id: string | undefined;
}

function CreateVisitorView({ ...props }: Props) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <form 
                onSubmit={props.handleSubmit((data) => props.onSubmit(data))} 
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800">New Visitor Registration</h2>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">CNIC</label>
                    <input 
                        {...props.register("cnic", { required: true, maxLength: 20 })} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter CNIC"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                    <input 
                        {...props.register("full_name", { required: true, maxLength: 20 })} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter Name"
                    />
                </div>

                {/* Hidden inputs */}
                <input {...props.register("check_in")} value={new Date().toISOString()} className="hidden" />
                <input {...props.register("user_id")} value={props.user_id} className="hidden" />

                <button 
                    type="submit" 
                    className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                >
                    Register Visitor
                </button>
            </form>
        </div>
    )
}

export default CreateVisitorView
