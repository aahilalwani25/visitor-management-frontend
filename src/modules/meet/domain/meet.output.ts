import { CreateMeetFormData, CreateMeetSuccess } from "./meet";

export interface MeetOutput{
    createMeet(formData: CreateMeetFormData): Promise<CreateMeetSuccess>
}