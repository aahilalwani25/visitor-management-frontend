import axios, { AxiosResponse } from 'axios';
import { API_URL } from './constant'

interface ErrorResponse {
    message: string
    errorCode: number
}

const publicAxios = axios.create({
    baseURL: API_URL,
    timeout: 20000,
})

publicAxios.interceptors.response.use(
    function (response) {
        return response
    },
    function (error) {
        console.log(error)
        if (error.response) {
            const errorResponse = error.response as AxiosResponse<ErrorResponse>
            const message = errorResponse.data?.message ?? error.response
            return Promise.reject(new Error(message))
        }
        return Promise.reject(new Error('Server Error'))
    }
)

export { publicAxios }
