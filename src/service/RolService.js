import { http } from './Http'

export default {
    listarRoles() {
        return http().get("/v1/role")
    },

    guardarRol(datos) {
        return http().post("/v1/role", datos)
    },

    mostrarRol(id) {
        return http().get("/v1/role/"+id)
    },

    asignarPermisos(permisos) {
        return http().post("/v1/role/asignar-permiso/", permisos)
    },
}