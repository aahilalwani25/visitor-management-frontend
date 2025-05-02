import { z } from "zod";

const CreateVisitorSchema= z.object({
    cnic: z.string({required_error:"Cnic required"}),
    full_name: z.string({required_error: "Full name required"})
})

export interface CreateUserFormData {
    user_id: string;
    full_name: string;
    cnic: string;
    check_in: string;
}