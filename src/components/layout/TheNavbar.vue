<template>
  <div>
    <header class="header d-flex" id="header">
      <div class="header_toggle d-flex" @click="$emit('toggleSidebar')">
        <i class="bi bi-list"></i>
        <div class="d-flex mx-2">
          <el-breadcrumb
            :separator-icon="ArrowRight"
            style="vertical-align: middle; display: flex"
          >
            <el-breadcrumb-item v-for="(path, index) in breadcrumb" :to="path">{{
              path == ""
                ? index == 0
                  ? "Homepage"
                  : "Bulletin"
                : path.charAt(0).toUpperCase() + path.slice(1).replace("-", " ")
            }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div>
        <b class="mx-2" style="margin: auto" v-if="user != undefined">{{
          user.displayName
        }}</b>
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-avatar
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                ><router-link to="/change-password"
                  >Đổi mật khẩu</router-link
                ></el-dropdown-item
              >
              <el-dropdown-item
                ><router-link to="/remove-group">Rời nhóm</router-link></el-dropdown-item
              >
              <el-dropdown-item>
                <router-link to="/delete-accout"
                  >Xoá tài khoản</router-link
                ></el-dropdown-item
              >
              <el-dropdown-item divided @click="logout">Đăng xuất</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
  </div>
</template>

<script>
import router from "../../router/index.ts";
import { ArrowRight } from "@element-plus/icons-vue";
import { RouterLink, RouterView } from "vue-router";
import { watch } from "vue";
import { useRoute } from "vue-router";

export default {
  data() {
    return {
      ArrowRight,
      RouterLink,
      breadcrumb: [],
    };
  },
  props: {
    user: Object,
  },
  created() {
    const route = useRoute();
    watch(
      route,
      (to) => {
        this.breadcrumb = location.pathname.split("/");
      },
      { flush: "pre", immediate: true, deep: true }
    );
  },
  methods: {
    // toggleSidebar() {
    //     this.emitter.emit('toggle-sidebar')
    // }
    logout() {
      localStorage.setItem(import.meta.env.VITE_TOKEN_NAME, "");
      router.push("/login");
    },
  },
};
</script>

<style scoped>
.header {
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: #f0f0f0;
}

.header i {
  font-size: 1.5rem;
}

.img-avatar {
  width: 2rem;
}
</style>
