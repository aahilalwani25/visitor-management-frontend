import { publicAxios } from "@/config/public.axios";
import { CreateUserFormData } from "../visitor";
import { Scan_Type } from "../domain/checkin.types";

export default class CheckinHttp implements CheckinOutput {

    async checkin(formData: FormData): Promise<CheckinSuccess> {
        try {
            const result = await publicAxios.postForm('/verify/', formData);
            return Promise.resolve(result?.data)
        } catch (error) {
            return Promise.reject(error);
        }
    }
    async createVisitor(data: CreateUserFormData, type: Scan_Type): Promise<CreateUserSuccess> {
        try {
            let result = null;

            switch (type) {
                case Scan_Type.CNIC:
                    result = await publicAxios.post('/create-user/', data);
                    break;
                case Scan_Type.DRIVING_LICENSE:
                    result = await publicAxios.post('/create-dl-user/', data);
                    break;

                case Scan_Type.VISITING_CARD:
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

    async scanId(formData: FormData, type: Scan_Type): Promise<CheckinSuccess> {
        try {
            let result = null;
            switch (type) {
                case Scan_Type.CNIC:
                    result = await publicAxios.postForm('/scan-cnic/', formData);
                    break;
                case Scan_Type.DRIVING_LICENSE:
                    result = await publicAxios.postForm('/scan-dl/', formData);
                    break;

                case Scan_Type.VISITING_CARD:
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