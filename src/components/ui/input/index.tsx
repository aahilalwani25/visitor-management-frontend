// "use client";
// import React from 'react'

// interface Props {
//     key: string
//     placeholder?: string
// }

// function Input({
//     ...props
// }: Props) {
//     return (
//         <input
//             {...props}
//             className="w-full px-4 py-2 placeholder:text-shadow-gray-500 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
//             placeholder={props.placeholder}
//             disabled={false}
//         />
//     )
// }

// export default Input

// components/ui/input.tsx
import React from 'react'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ ...props }, ref) => {
        return <input ref={ref} {...props} className="w-full px-4 py-2 placeholder:text-shadow-gray-500 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300" />
    }
)

Input.displayName = 'Input'
export default Input