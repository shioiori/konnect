<template>
  <div>
    <el-container>
      <el-row :gutter="0">
        <el-col :span="4">
          <TheSidebar :user="user" />
        </el-col>
        <el-col :span="20">
          <el-header style="padding: 0">
            <TheNavbar :user="user" />
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
import { RouterLink, RouterView } from "vue-router";
import TheNavbar from "../components/layout/TheNavbar.vue";
import TheSidebar from "../components/layout/TheSidebar.vue";
import axios from "axios";
import router from "../router/index.ts";
import { getHeaderConfig } from "../utils/ApiHandler.js";

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
  },
  data() {
    return {
      user: undefined,
    };
  },
};
</script>

<style></style>
