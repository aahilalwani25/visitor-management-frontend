export interface CreateMeetSuccess{
    status: number,
    message: string,
    data: any
}

export interface CreateMeetFormData{
    user_id: string
    company_name: string
    meet_person: string
}