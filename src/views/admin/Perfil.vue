<template>
    <div class="card" v-if="ability.can('delete', 'user')">
        <h1>PERFIL</h1>
        {{ perfil }}
    </div>
    <div class="card" v-else>
        <h1>NO TIENE LOS PERMISOS</h1>
    </div>
</template>

<script>
import * as authService from '@/service/AuthService.js'
import {onMounted, ref} from "vue"
import ability from "@/acl/ability"

export default {
    setup() {

        const perfil = ref({})

        onMounted( async () => {
            const {data} = await authService.perfil()
            perfil.value = data

            console.log('aaaa')
            console.log(ability)
            console.log(ability.can('create','role'))
        })

        return {
            perfil,
            ability
        }
    }
}
</script>

<style>

</style>