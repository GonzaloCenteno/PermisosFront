import { http } from './Http'

export default {
    listarUsuarios() {
        return http().get("/v1/usuario")
    },

    guardarUsuario(datos) {
        return http().post("/v1/usuario", datos)
    },

    modificarUsuario(id, datos) {
        return http().put(`/v1/usuario/${id}`, datos)
    },

    eliminarUsuario(id) {
        return http().delete(`/v1/usuario/${id}`)
    }
}