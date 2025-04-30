import { publicAxios } from "@/config/public.axios";

export default class CheckinHttp implements CheckinOutput{

    async checkin(formData: FormData): Promise<CheckinSuccess> {
        try {
            const result= await publicAxios.postForm('/checkin/',formData);
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

    async checkout(formData: FormData): Promise<CheckinSuccess> {
        try {
            const result= await publicAxios.postForm('/checkout/',formData);
            return Promise.resolve(result?.data)
        } catch (error) {
            return Promise.reject(error);
        }
    }

}