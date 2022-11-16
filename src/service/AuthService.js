import { http, urlBase } from "./Http"

export function loginLaravel(datos) {
    return http().post("/v1/auth/login", datos)
}

export const perfil = function () {
    return http().post("/v1/auth/perfil")
}

export const salir = function () {
    return http().post("/v1/auth/logout")
}