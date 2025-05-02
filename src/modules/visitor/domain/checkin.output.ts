interface CheckinSuccess{
    status: number,
    message: string,
    data: any
}

interface CreateUserSuccess{
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
    checkout(formData: FormData): Promise<CheckOutSuccess>

}