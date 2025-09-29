import { publicAxios } from "@/config/public.axios";
import { MeetOutput } from "../domain/meet.output";
import { CreateMeetFormData, CreateMeetSuccess } from "../domain/meet";

export default class MeetHttp implements MeetOutput{

    async createMeet(data: CreateMeetFormData): Promise<CreateMeetSuccess> {
        try {
            const result= await publicAxios.post('/create-meet/',data);
            return Promise.resolve(result?.data)
        } catch (error) {
            return Promise.reject(error);
        }
    }
}