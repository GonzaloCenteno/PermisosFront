<template>
    <!-- <h1>Ingresar Credenciales</h1>
    {{ usuario }}
    <hr>
    <label for="">Ingrese Correo:</label>
    <input type="email" v-model="usuario.email">
    <span v-if="errores.email">{{ errores.email[0] }}</span>
    <br>
    <label for="">Ingrese Contraseña:</label>
    <input type="password" v-model="usuario.password">
    <span v-if="errores.password">{{ errores.password[0] }}</span>
    <br> 

    <button @click="ingresar()">INGRESAR</button>
    {{ errores }} -->

    <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="grid justify-content-center p-2 lg:p-0" style="min-width:80%">
            <div class="col-12 xl:col-6" style="border-radius:56px; padding:0.3rem; background: linear-gradient(180deg, var(--primary-color), rgba(33, 150, 243, 0) 30%);">
                <div class="h-full w-full m-0 py-7 px-4" style="border-radius:53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0));">
                    <div class="text-center mb-5">
                        <img src="layout/images/avatar.png" alt="Image" height="50" class="mb-3">
                        <div class="text-900 text-3xl font-medium mb-3">Bienvenido</div>
                        <span class="text-600 font-medium">Iniciar Sesion</span>
                    </div>
                
                    <div class="w-full md:w-10 mx-auto">
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Correo:</label>
                        <InputText id="email1" v-model="usuario.email" type="text" class="w-full mb-3" placeholder="Email" style="padding:1rem;" />
                
                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Contraseña:</label>
                        <Password id="password1" v-model="usuario.password" placeholder="Contraseña" :toggleMask="true" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem"></Password>
                
                        <div class="flex align-items-center justify-content-between mb-5">
                            <div class="flex align-items-center">
                                <Checkbox id="rememberme1" v-model="checked" :binary="true" class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                        </div>
                        <Button label="Ingresar" class="w-full p-3 text-xl" @click="ingresar()"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as authService from '@/service/AuthService.js'
import {ref} from "vue"
import { useRouter } from "vue-router"
import ability from '@/acl/ability'

export default {
    setup() {
        
        const router = useRouter()

        const usuario = ref({})
        const checked = false
        const errores = ref({})

        const ingresar = async () => {
            try {
                const {data} = await authService.loginLaravel(usuario.value)
                console.log(data)
                localStorage.setItem("token", data.accessToken)

                if(data.usuario.roles.length > 0){
                    data.ability = data.usuario.roles[0].permisos
                } else {
                    data.ability = []
                }

                data.ability.push({
                    action: 'read',
                    subject: 'Auth'
                })
                
                localStorage.setItem("userData", JSON.stringify(data))

                ability.update(data.ability)

                router.push({ name: 'Perfil' })
            } catch (error) {
                console.log(error)
                if(error.response.status === 422){
                    errores.value = error.response.data.errors
                }
            }
        }

        return {
            usuario,
            ingresar,
            errores,
            checked
        }
    }
}
</script>

<style>
.pi-eye {
    transform:scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform:scale(1.6);
    margin-right: 1rem;
}
</style>