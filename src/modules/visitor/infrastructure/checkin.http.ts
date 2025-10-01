import { publicAxios } from "@/config/public.axios";
import { CreateUserFormData } from "../visitor";

export default class CheckinHttp implements CheckinOutput {

    async checkin(formData: FormData): Promise<CheckinSuccess> {
        try {
            const result = await publicAxios.postForm('/verify/', formData);
            return Promise.resolve(result?.data)
        } catch (error) {
            return Promise.reject(error);
        }
    }
    async createVisitor(data: CreateUserFormData, type: "cnic" | "dl" | "vc"): Promise<CreateUserSuccess> {
        try {
            let result = null;

            switch (type) {
                case "cnic":
                    result = await publicAxios.post('/create-user/', data);
                    break;
                case "dl":
                    result = await publicAxios.post('/create-dl-user/', data);
                    break;

                case "vc":
                    result = await publicAxios.post('/create-visiting-card-user/', data);
                    break;

                default:
                    result = await publicAxios.post('/create-user/', data);
                    break;
            }
            return Promise.resolve(result?.data)
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async scanId(formData: FormData, type: "cnic" | "dl" | "vc"): Promise<CheckinSuccess> {
        try {
            let result = null;
            switch (type) {
                case "cnic":
                    result = await publicAxios.postForm('/scan-cnic/', formData);
                    break;
                case "dl":
                    result = await publicAxios.postForm('/scan-dl/', formData);
                    break;

                case "vc":
                    result = await publicAxios.postForm('/scan-visiting-card/', formData);
                    break;

                default:
                    result = await publicAxios.postForm('/scan-cnic/', formData);
                    break;

            }
            return Promise.resolve(result?.data)
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async checkout(formData: FormData): Promise<CheckOutSuccess> {
        try {
            const result = await publicAxios.postForm('/checkout/', formData);
            return Promise.resolve(result?.data)
        } catch (error) {
            return Promise.reject(error);
        }
    }

}