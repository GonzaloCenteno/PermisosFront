import axios from "axios"

export const urlBase = "http://127.0.0.1:8000/api"

export const http = () => {
    let token = localStorage.getItem("token")
    const interceptor = axios.create({
        baseURL: urlBase,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        timeout: 20000
    })

    interceptor.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            if(error.response.status === 401) {
                localStorage.removeItem("token")
                window.location.href = "/login"
            }

            if(error.response.status === 403) {
                window.location.href = "/no-autorizado"
            }

            return Promise.reject(error)
        }
    )

    return interceptor
}