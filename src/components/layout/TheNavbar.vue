<template>
    <div>
        <header class="header d-flex" id="header">
            <div class="header_toggle" @click="$emit('toggleSidebar')"><i class="bi bi-list"></i></div>
            <div class="dropdown">
                <b class="mx-2">string</b>
                <img class="dropdown-toggle img-responsive rounded-circle img-avatar" src="https://i.imgur.com/hczKIze.jpg"
                    alt="dropdown image" data-bs-toggle="dropdown">
                <ul class="dropdown-menu">
                    <li class="px-2"><a @click="logout">Log Out</a></li>
                </ul>
            </div>
        </header>
    </div>
</template>

<script>
import router from '../../router/index.ts';

export default {
    data() {
        return {}
    },
    methods: {
        // toggleSidebar() {
        //     this.emitter.emit('toggle-sidebar')
        // }
        logout() {
            localStorage.setItem(import.meta.env.VITE_TOKEN_NAME, '');
            router.push('/login')
        }
    }
}
</script>

<style scoped>
.header {
    justify-content: space-between;
    padding: .5rem 1rem;
    background: #f0f0f0;
}

.header i {
    font-size: 1.5rem;
}

.img-avatar {
    width: 2rem;
}
</style>