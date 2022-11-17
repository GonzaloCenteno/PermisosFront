<template>
    <div class="card">
        <Toast />
        <ConfirmDialog></ConfirmDialog>

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
                <Dropdown v-model="usuario.role" :options="roles" optionLabel="nombre" optionValue="nombre" placeholder="Seleccionar Rol" />
            </div>
            <template #footer>
                <Button label="Cerrar" icon="pi pi-times" @click="closeModalAddRol" class="p-button-text"/>
                <Button label="Guardar" icon="pi pi-check" @click="asignarRol" autofocus />
            </template>
        </Dialog>

        <Dialog header="Editar Usuario" v-model:visible="displayModalEditar" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}" :modal="true" class="p-fluid">
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
                <Button label="Cancelar" icon="pi pi-times" @click="closeModalEditar" class="p-button-text"/>
                <Button label="Editar" icon="pi pi-check" @click="modificarUsuario" autofocus />
            </template>
        </Dialog>
    
        <ProgressBar mode="indeterminate" style="height: .5em" v-if="cargando" />
        <DataTable :value="usuarios" responsiveLayout="scroll">
            <Column field="id" header="ID"></Column>
            <Column field="name" header="NOMBRE"></Column>
            <Column field="email" header="CORREO"></Column>
            <Column field="roles" header="ROLES">
                <template #body="slotProps">
                    <template v-for="rol in slotProps.data.roles" :key="rol.id">
                        <Button :label="rol.nombre" icon="pi pi-times" iconPos="right" @click="removerRol(slotProps.data.id, rol.nombre)" class="p-button-rounded p-button-success p-button-sm" />
                    </template>
                    <Button icon="pi pi-bell" class="p-button-rounded p-button-success" @click="openModalAddRol(slotProps.data)" />
                </template>
            </Column>
            <Column field="accion">
                <template #body="slotProps">
                    <Button label="Editar" icon="pi pi-external-link" @click="openModalEditar(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>
    
</template>

<script>
import UsuarioService from "@/service/UsuarioService"
import RolService from '@/service/RolService';
import { ref, onMounted } from "vue"
import { useAbility } from "@casl/vue"
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"

export default {

    setup(){
        const usuarios = ref([])
        const roles = ref([])
        const displayModal = ref(false)
        const usuario = ref({})
        const submitted = ref(false)
        const { can } = useAbility()
        const displayModalAddRol  = ref(false)
        const displayModalEditar = ref(false)

        const confirm = useConfirm();
        const toast = useToast();
        const cargando = ref(false)

        onMounted(async() => {
            listarUsuario()
            const {data} = await RolService.listarRoles()
            roles.value = data
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
            usuario.value = {}
        }

        const openModalEditar = (user) => {
            usuario.value = user
            displayModalEditar.value = true
        }

        const closeModalEditar = () => {
            usuario.value = {}
            displayModalEditar.value = false
        }

        const asignarRol = async () => {
            const {id, role} = usuario.value
            const obj = {
                user_id: id,
                role: role
            }
            cargando.value = true
            const {data} = await UsuarioService.asignarRol(obj)
            console.log(data)
            closeModalAddRol()
            listarUsuario()
        }
        
        const removerRol = async (idUsuario, nombreRol) => {
            confirm.require({
                message: '¿Esta seguro de quitar el rol al usuario?',
                header: 'Confirmar Accion',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                accept: async () => {
                    const obj = {
                        user_id: idUsuario,
                        role: nombreRol
                    }
                    cargando.value = true
                    const {data} = await UsuarioService.removerRol(obj)
                    console.log(data)
                    closeModalAddRol()
                    listarUsuario()
                    toast.add({severity:'success', summary:'Rol Removido', detail:'Se ha desvinculado el rol', life: 3000});
                },
                reject: () => {
                    toast.add({severity:'error', summary:'Rejected', detail:'You have rejected', life: 3000});
                }
            });
        }

        const listarUsuario = async () => {
            cargando.value = true
            const { data } = await UsuarioService.listarUsuarios()
            usuarios.value = data.data
            cargando.value = false
        }

        const guardarUsuario = async () => {
            try {
                cargando.value = true
                const {data} = await UsuarioService.guardarUsuario(usuario.value)
                listarUsuario()
                closeModal()
            } catch (error) {
                console.log(error);
            }
        }

        const modificarUsuario = async () => {
            try {
                cargando.value = true
                const {data} = await UsuarioService.modificarUsuario(usuario.value.id,usuario.value)
                listarUsuario()
                closeModalEditar()
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
            guardarUsuario,
            openModalAddRol,
            closeModalAddRol,
            asignarRol,
            displayModalAddRol,
            roles,
            displayModalEditar,
            openModalEditar,
            closeModalEditar,
            modificarUsuario,
            removerRol,
            cargando
        }
    }

}
</script>

<style>

</style>