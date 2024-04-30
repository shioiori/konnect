<template>
    <div>
        <header class="header d-flex" id="header">
            <div class="header_toggle d-flex" @click="$emit('toggleSidebar')">
                <i class="bi bi-list"></i>
                <div class="d-flex mx-2">
                    <el-breadcrumb :separator-icon="ArrowRight" style="vertical-align: middle; display: flex;">
                        <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
                        <el-breadcrumb-item>promotion management</el-breadcrumb-item>
                        <el-breadcrumb-item>promotion list</el-breadcrumb-item>
                        <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </div>
            <div>
                <b class="mx-2" style="margin: auto">string</b>
                <el-dropdown>
                    <span class="el-dropdown-link">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>Action 1</el-dropdown-item>
                            <el-dropdown-item>Action 2</el-dropdown-item>
                            <el-dropdown-item>Action 3</el-dropdown-item>
                            <el-dropdown-item disabled>Action 4</el-dropdown-item>
                            <el-dropdown-item divided @click="logout">Log out</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </header>
    </div>
</template>

<script>
import router from '../../router/index.ts';
import { ArrowRight } from '@element-plus/icons-vue'

export default {
    data() {
        return {
            ArrowRight
        }
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