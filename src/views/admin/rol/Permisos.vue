<template>
  <div class="card" v-if="role">
    <h1>Rol: {{ role.nombre }}</h1>

    <div class="field-checkbox" v-for="permiso in listaPermisos" :key="permiso.id">
        <Checkbox name="permiso" :value="permiso.id" v-model="permisos" />
        <label for="city1">{{ permiso.detalle }}</label>
    </div>

    <button @click="actualizarPermisos()">Actualizar</button>

  </div>
</template>

<script>
import RolService from '@/service/RolService';
import PermisoService from '@/service/PermisoService';

export default {
    data(){
        return {
            rol_id: null,
            role: null,
            permisos: [],
            listaPermisos: []
        }
    },
    async mounted(){
        this.rol_id = this.$route.params.id
        const {data} = await RolService.mostrarRol(this.rol_id)
        this.role = data
        const permiso = await PermisoService.listarPermiso()
        this.listaPermisos = permiso.data.data
    },
    methods: {
        async actualizarPermisos(){
            let datos = {
                role_id: this.rol_id,
                permisos: this.permisos
            }
            await RolService.asignarPermisos(datos)
        }
    }
}
</script>

<style>

</style>