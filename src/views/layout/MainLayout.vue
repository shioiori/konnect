<template>
    <div>
        <TheNavbar />
        <RouterView />
        <TheSidebar />
    </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import TheNavbar from '../../components/layout/TheNavbar.vue'
import TheSidebar from '../../components/layout/TheSidebar.vue'

export default {
    components: {
        TheNavbar,
        TheSidebar,
        RouterView
    }
}
</script>

<style></style>