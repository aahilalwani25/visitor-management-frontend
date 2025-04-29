interface CheckinSuccess{
    status: number,
    message: string
}

interface CheckOutSuccess{
    status: number,
    message: string
}

interface CheckinOutput{
    checkin(formData: FormData): Promise<CheckinSuccess>
    checkin(formData: FormData): Promise<CheckOutSuccess>
}