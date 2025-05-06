import { publicAxios } from "@/config/public.axios";

export default class CheckinHttp implements CheckinOutput{

    async checkin(formData: FormData): Promise<CheckinSuccess> {
        try {
            const result= await publicAxios.postForm('/verify/',formData);
            return Promise.resolve(result?.data)
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async createVisitor(data: {
        user_id: string
        full_name: string
        cnic: string
        check_in: string
    }): Promise<CreateUserSuccess> {
        try {
            const result= await publicAxios.post('/create-user/',data);
            return Promise.resolve(result?.data)
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async scanCnic(formData: FormData): Promise<CheckinSuccess> {
        try {
            const result= await publicAxios.postForm('/scan-cnic/',formData);
            return Promise.resolve(result?.data)
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async checkout(formData: FormData): Promise<CheckOutSuccess> {
        try {
            const result= await publicAxios.postForm('/checkout/',formData);
            return Promise.resolve(result?.data)
        } catch (error) {
            return Promise.reject(error);
        }
    }

}