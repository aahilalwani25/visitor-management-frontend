"use client";
import React from 'react'

interface Props {
    key: string
    placeholder?: string
}

function Input({
    ...props
}: Props) {
    return (
        <input
            // {...props.register(props.key, { required: true })}
            className="w-full px-4 py-2 placeholder:text-shadow-gray-500 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
            placeholder={props.placeholder}
            disabled={false}
        />
    )
}

export default Input
