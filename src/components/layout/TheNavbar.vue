<template>
  <div v-if="user">
    <header class="header d-flex" id="header">
      <div class="header_toggle d-flex" @click="$emit('toggleSidebar')">
        <i class="bi bi-list"></i>
        <div class="d-flex mx-2">
          <el-breadcrumb
            :separator-icon="ArrowRight"
            style="vertical-align: middle; display: flex"
          >
            <el-breadcrumb-item v-for="(item, index) in breadcrumb">
              {{ item.name }}</el-breadcrumb-item
            >
          </el-breadcrumb>
        </div>
      </div>
      <div class="d-flex">
        <div class="navbar-bell">
          <navbar-notification />
        </div>
        <b class="mx-2" style="margin: auto" v-if="user">{{ user.displayName }}</b>
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-avatar :src="user.avatar" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                ><router-link to="/user" style="color: #000; text-decoration: none"
                  ><el-text
                    ><el-icon>
                      <User /> </el-icon
                    >Trang cá nhân</el-text
                  ></router-link
                ></el-dropdown-item
              >
              <el-dropdown-item @click="chooseGroup"
                ><el-text
                  ><el-icon>
                    <Bicycle /> </el-icon
                  >Vào nhóm khác
                </el-text></el-dropdown-item
              >
              <el-dropdown-item @click="outGroup" v-if="group && group.allowOut"
                ><el-text type="danger"
                  ><el-icon>
                    <Guide /> </el-icon
                  >Rời nhóm</el-text
                ></el-dropdown-item
              >
              <el-dropdown-item @click="deleteAccount">
                <el-text type="danger"
                  ><el-icon>
                    <Delete /> </el-icon
                  >Xoá tài khoản</el-text
                ></el-dropdown-item
              >
              <el-dropdown-item divided @click="logout"
                ><el-text type="info"
                  ><el-icon>
                    <SwitchButton /> </el-icon
                  >Đăng xuất</el-text
                ></el-dropdown-item
              >
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
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";
import { ElMessage, ElMessageBox } from "element-plus";

import NavbarNotification from "./NavbarNotification.vue";

export default {
  components: {
    NavbarNotification,
  },
  data() {
    return {
      ArrowRight,
      RouterLink,
      breadcrumb: [],
      group: undefined,
    };
  },
  props: {
    user: Object,
  },
  watch: {
    user(oldValue, newValue) {
      if (this.user && !this.user.avatar) {
        this.user.avatar = "../../src/assets/images/avatar_default.png";
      }
    },
  },
  created() {
    const route = useRoute();
    watch(
      route,
      (to) => {
        this.breadcrumb = [];
        var paths = location.pathname.split("/");
        paths.forEach((path) => {
          let name = path.charAt(0).toUpperCase() + path.slice(1).replace("-", " ");
          if (path == "" || path == "bulletin") {
            if (this.breadcrumb.length == 0) name = "Home";
            else return;
          }
          this.breadcrumb.push({
            path: path,
            name: name,
          });
        });
        console.log(this.breadcrumb);
      },
      { flush: "pre", immediate: true, deep: true }
    );
  },
  methods: {
    getGroup() {
      axios.get(import.meta.env.VITE_API + "/group", getHeaderConfig()).then((res) => {
        this.group = res.data.group;
      });
    },
    logout() {
      localStorage.setItem(import.meta.env.VITE_TOKEN_NAME, "");
      router.push("/login");
    },
    outGroup() {
      ElMessageBox.confirm("Bạn sẽ rời khỏi nhóm vĩnh viễn. Tiếp tục?", "Warning", {
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          axios
            .delete(import.meta.env.VITE_API + "/group/out", getHeaderConfig())
            .then((res) => {
              ElMessage({
                type: res.data.type,
                message: res.data.message,
              });
            });
        })
        .catch((e) => {
          ElMessage({
            message: e.message,
            type: "error",
          });
        });
    },
    deleteAccount() {
      ElMessageBox.confirm(
        "Tài khoản sẽ không thể khôi phục được nữa. Tiếp tục?",
        "Warning",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          axios
            .delete(
              import.meta.env.VITE_API + "/user/" + this.user.userName,
              getHeaderConfig()
            )
            .then((res) => {
              ElMessage({
                type: res.data.type,
                message: res.data.message,
              });
              this.logout();
            });
        })
        .catch((e) => {
          ElMessage({
            message: e.message,
            type: "error",
          });
        });
    },
    chooseGroup() {
      router.push("/group");
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

.navbar-bell {
  display: flex;
  align-items: center;
  transform: scale(1.25);
}
</style>
