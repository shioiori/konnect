<template>
    <div>
        <el-container>
            <el-row :gutter="0">
                <el-col :span="4">
                    <TheSidebar />
                </el-col>
                <el-col :span="20">
                    <el-header>
                        <TheNavbar />
                    </el-header>
                    <el-main>
                        <RouterView />
                    </el-main>
                </el-col>
            </el-row>
        </el-container>
    </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import TheNavbar from '../components/layout/TheNavbar.vue'
import TheSidebar from '../components/layout/TheSidebar.vue'

export default {
    components: {
        TheNavbar,
        TheSidebar,
        RouterView
    }
}
</script>

<style></style>