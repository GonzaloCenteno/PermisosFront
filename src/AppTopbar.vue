<template>
	<div class="layout-topbar">
		<router-link to="/" class="layout-topbar-logo">
			<img alt="Logo" :src="topbarImage()" />
			<span>EMPRESA</span>
		</router-link>
		<button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
			<i class="pi pi-bars"></i>
		</button>

		<button class="p-link layout-topbar-menu-button layout-topbar-button"
			v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein', 
			leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true}">
			<i class="pi pi-ellipsis-v"></i>
		</button>
		<ul class="layout-topbar-menu hidden lg:flex origin-top">
			<li>
				<button class="p-link layout-topbar-button">
					<i class="pi pi-cog"></i>
					<span>Config</span>
				</button>
			</li>
			<li>
				<button class="p-link layout-topbar-button" @click="redireccionar('/admin/perfil')">
					<i class="pi pi-user"></i>
					<span>Perfil</span>
				</button>

				<button class="p-link layout-topbar-button" @click="salir()">
					<i class="pi pi-power-off"></i>
					<span>Salir</span>
				</button>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
    methods: {
        onMenuToggle(event) {
            this.$emit('menu-toggle', event);
        },
		onTopbarMenuToggle(event) {
            this.$emit('topbar-menu-toggle', event);
        },
		topbarImage() {
			return this.$appState.darkTheme ? '/images/logo-white.svg' : '/images/logo-dark.svg';
		},
		redireccionar(ruta) {
			this.$router.push(ruta)
		},
		salir() {
			localStorage.removeItem('token')
			localStorage.removeItem('userData')
			this.$router.push('/login')
		}
    },
	computed: {
		darkTheme() {
			return this.$appState.darkTheme;
		}
	}
}
</script>