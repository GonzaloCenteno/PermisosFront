<template>

    <Button label="Nuevo Usuario" icon="pi pi-external-link" @click="openModal" v-if="can('create', 'user')" />
    <Dialog header="Nuevo Usuario" v-model:visible="displayModal" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '40vw'}" :modal="true" class="p-fluid">
        <div class="field">
            <label for="nombre">Ingrese Nombre</label>
            <InputText id="nombre" v-model.trim="usuario.name" required="true" autofocus :class="{'p-invalid': submitted && !usuario.name}" />
            <small class="p-error" v-if="submitted && !usuario.name">El Nombre es Obligatorio.</small>
        </div>
        <div class="field">
            <label for="correo">Ingrese Correo</label>
            <InputText id="correo" v-model.trim="usuario.email" required="true" autofocus :class="{'p-invalid': submitted && !usuario.email}" />
            <small class="p-error" v-if="submitted && !usuario.email">El Correo es Obligatorio.</small>
        </div>
        <div class="field">
            <label for="password">Ingrese Contraseña</label>
            <InputText type="password" id="password" v-model.trim="usuario.password" required="true" autofocus :class="{'p-invalid': submitted && !usuario.password}" />
            <small class="p-error" v-if="submitted && !usuario.password">El Contraseña es Obligatorio.</small>
        </div>
        <template #footer>
            <Button label="Cerrar" icon="pi pi-times" @click="closeModal" class="p-button-text"/>
            <Button label="Guardar" icon="pi pi-check" @click="guardarUsuario" autofocus />
        </template>
    </Dialog>

    <Dialog header="Asignar Rol" v-model:visible="displayModalAddRol" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '40vw'}" :modal="true" class="p-fluid">
        <div class="field">
            <label for="nombre">Usuario</label>
            <InputText id="nombre" v-model.trim="usuario.name" required="true" readonly />
            <small class="p-error" v-if="submitted && !usuario.name">El Nombre es Obligatorio.</small>
        </div>
        <div class="field">
            <label for="correo">Seleccionar Rol</label>
            <InputText id="correo" v-model.trim="usuario.email" required="true" autofocus :class="{'p-invalid': submitted && !usuario.email}" />
            <small class="p-error" v-if="submitted && !usuario.email">El Correo es Obligatorio.</small>
        </div>
        <template #footer>
            <Button label="Cerrar" icon="pi pi-times" @click="closeModalAddRol" class="p-button-text"/>
            <Button label="Guardar" icon="pi pi-check" @click="asignarRol" autofocus />
        </template>
    </Dialog>
    
    <div class="card">
        <DataTable :value="usuarios" responsiveLayout="scroll">
            <Column field="id" header="ID"></Column>
            <Column field="name" header="NOMBRE"></Column>
            <Column field="email" header="CORREO"></Column>
            <Column field="roles" header="ROLES">
                <template #body="slotProps">
                    <ul>
                        <li v-for="rol in slotProps.data.roles" :key="rol.id">
                            <span class="'product-badge status-success'">{{ rol.nombre }}</span>
                        </li>
                    </ul>
                    <Button icon="pi pi-bell" class="p-button-rounded p-button-success" @click="openModalAddRol(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>
    
</template>

<script>
import UsuarioService from "@/service/UsuarioService"
import { ref, onMounted } from "vue"
import { useAbility } from "@casl/vue"

export default {

    setup(){
        const usuarios = ref([])
        const displayModal = ref(false)
        const usuario = ref({})
        const submitted = ref(false)
        const { can } = useAbility()
        const displayModalAddRol  = ref(false)

        onMounted(async() => {
            listarUsuario()
        })

        const openModal = () => {
            displayModal.value = true;
        }

        const closeModal = () => {
            displayModal.value = false;
            usuario.value = {}
        }

        const openModalAddRol = (user) => {
            usuario.value = user
            displayModalAddRol.value = true;
        }

        const closeModalAddRol = () => {
            displayModalAddRol.value = false;
        }

        const asignarRol = () => {

        }

        const listarUsuario = async () => {
            const { data } = await UsuarioService.listarUsuarios()
            usuarios.value = data.data
        }

        const guardarUsuario = async () => {
            try {
                const {data} = await UsuarioService.guardarUsuario(usuario.value)
                listarUsuario()
                closeModal()
            } catch (error) {
                console.log(error);
            }
        }

        return {
            usuarios,
            displayModal,
            openModal,
            closeModal,
            usuario,
            submitted,
            can,
            guardarUsuario
        }
    }

}
</script>

<style>

</style>