<template>
    <Toast />
    <div class="card" v-if="role">
        <h1>Rol: {{ role.nombre }}</h1>

        <Button label="Nuevo Permiso" icon="pi pi-external-link" @click="openModal" />
        <Dialog header="Nuevo Permiso" v-model:visible="displayModal" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}" :modal="true" class="p-fluid">
            <div class="field">
                <label for="action">Ingrese Action</label>
                <InputText id="action" v-model.trim="permiso.action" required="true" autofocus />
            </div>
            <div class="field">
                <label for="suject">Ingrese Subject</label>
                <InputText id="suject" v-model.trim="permiso.subject" required="true" />
            </div>
            <div class="field">
                <label for="detalle">Ingrese Detalle</label>
                <InputText id="detalle" v-model.trim="permiso.detalle" required="true" />
            </div>
            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" @click="closeModal" class="p-button-text"/>
                <Button label="Guardar Permiso" icon="pi pi-check" @click="guardarPermiso" autofocus />
            </template>
        </Dialog>

        <div class="field-checkbox" v-for="permiso in listaPermisos" :key="permiso.id">
            <Checkbox name="permiso" :value="permiso.id" v-model="permisos" />
            <label for="city1">{{ permiso.detalle }}</label>
        </div>

        <Button label="Actualizar" class="p-button-success" @click="actualizarPermisos()" />

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
            listaPermisos: [],
            displayModal: false,
            permiso: {
                action: '',
                subject: '',
                detalle: ''
            }
        }
    },
    async mounted(){
        this.rol_id = this.$route.params.id
        const {data} = await RolService.mostrarRol(this.rol_id)
        this.role = data
        const permiso = await PermisoService.listarPermiso()
        this.listaPermisos = permiso.data.data
        for (let i = 0; i < this.listaPermisos.length; i++) {
            const permiso = this.listaPermisos[i]
            if(this.verificar(permiso)){
                this.permisos.push(permiso.id)
            }
        }
    },
    methods: {
        async actualizarPermisos() {
            try {
                let datos = {
                    role_id: this.rol_id,
                    permisos: this.permisos
                }
                await RolService.asignarPermisos(datos)
                this.$toast.add({severity:'success', summary: 'Permisos Actualizados', detail:'Los Permisos fueron actualizados', life: 3000});
            } catch (error) {
                this.$toast.add({severity:'error', summary: 'Error Al Actualizar', detail: error, life: 3000});
            }
        },
        verificar(permiso) {
            let contador = 0;
            for (let j = 0; j < this.role.permisos.length; j++) {
                const element = this.role.permisos[j];
                if(element.action == permiso.action && element.subject == permiso.subject){
                    contador++;
                }
            }
            if(contador > 0) {
                return true
            }
            return false
        },
        openModal(){
            this.displayModal = true
        },
        closeModal(){
            this.displayModal = false
        },
        async guardarPermiso(){
            const {data} = await PermisoService.guardarPermiso(this.permiso)
            const permiso = await PermisoService.listarPermiso()
            this.listaPermisos = permiso.data.data
            this.closeModal()
        }
    }
}
</script>

<style>

</style>