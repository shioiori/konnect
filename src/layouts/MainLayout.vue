<template>
  <div>
    <el-container>
      <el-row :gutter="0">
        <el-col :span="3">
          <TheSidebar :user="user" />
        </el-col>
        <el-col :span="21">
          <el-header style="padding: 0" class="navbar-container">
            <TheNavbar :user="user" />
          </el-header>
          <el-main class="main-content">
            <el-scrollbar> <RouterView :user="user" /> </el-scrollbar>
          </el-main>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
import TheNavbar from "../components/layout/TheNavbar.vue";
import TheSidebar from "../components/layout/TheSidebar.vue";
import axios from "axios";
import router from "../router/index.ts";
import { getHeaderConfig } from "../utils/ApiHandler.js";
import { ElMessage } from "element-plus";

export default {
  components: {
    TheNavbar,
    TheSidebar,
    RouterView,
  },
  created() {
    axios
      .get(import.meta.env.VITE_API + "/user", getHeaderConfig())
      .then((res) => {
        this.user = res.data;
      })
      .catch((err) => {
        ElMessage({
          message: "Không tìm thấy thông tin đăng nhập của người dùng",
          type: "error",
        });
        router.push("/login");
      });

    console.log(this.user);
  },
  data() {
    return {
      user: undefined,
    };
  },
};
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
.navbar-container {
  height: 7vh;
}

.main-container {
}
</style>
