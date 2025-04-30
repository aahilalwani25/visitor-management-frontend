interface CheckinSuccess{
    status: number,
    message: string,
    data: any
}

interface CheckOutSuccess{
    status: number,
    message: string,
    data: any
}

interface CheckinOutput{
    checkin(formData: FormData): Promise<CheckinSuccess>
    checkin(formData: FormData): Promise<CheckOutSuccess>
}