<template>
  <section class="vh-100">
    <div class="container-fluid h-custom">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-md-9 col-lg-6 col-xl-5">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            class="img-fluid"
            alt="Sample image"
          />
        </div>
        <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
          <div class="divider d-flex align-items-center my-4">
            <h3 class="text-center mx-3 mb-0 display-6">Đăng ký</h3>
          </div>
          <el-form :model="user" label-width="auto" class="demo-dynamic">
            <el-form-item prop="userName" label="Username" required>
              <el-input v-model="user.userName" />
            </el-form-item>
            <el-form-item prop="password" label="Mật khẩu" required>
              <el-input type="password" v-model="user.password" />
            </el-form-item>
            <el-form-item prop="displayName" label="Tên hiển thị" required>
              <el-input v-model="user.displayName" required />
            </el-form-item>
            <el-form-item
              prop="email"
              label="Email"
              :rules="[
                {
                  required: true,
                  message: 'Xin hãy nhập địa chỉ email',
                  trigger: 'blur',
                },
                {
                  type: 'email',
                  message: 'Hãy nhập đúng địa chỉ email',
                  trigger: ['blur', 'change'],
                },
              ]"
            >
              <el-input v-model="user.email" />
            </el-form-item>
            <el-form-item prop="phoneNumber" label="Số điện thoại">
              <el-input v-model="user.phoneNumber" />
            </el-form-item>

            <el-form-item prop="groupId" label="Mã mời">
              <el-input v-model="user.groupId" />
              <small class="text-muted text-end"
                ><i
                  >Nếu bạn không có mã mời, một group mới của riêng bạn sẽ được tạo</i
                ></small
              >
            </el-form-item>
          </el-form>
          <div class="text-end">
            <el-button
              type="primary"
              style="padding-left: 2.5rem; padding-right: 2.5rem"
              @click="register"
              v-loading.fullscreen.lock="fullscreenLoading"
            >
              Đăng ký
            </el-button>
          </div>
          <div class="mt-2 text-end">
            <el-text tag="b">
              Có tài khoản?
              <el-link type="primary" href="/login">Đăng nhập</el-link>
            </el-text>
          </div>
        </div>
      </div>
    </div>
    <div
      class="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary"
    >
      <!-- Copyright -->
      <div class="text-white mb-3 mb-md-0">Copyright © 2024. All rights reserved.</div>
      <!-- Copyright -->
    </div>
  </section>
</template>
<script>
import axios from "axios";
import router from "../router/index.ts";
import { ElMessage } from "element-plus";
import { reactive } from "vue";

export default {
  data() {
    return {
      user: reactive({
        userName: null,
        password: null,
        displayName: null,
        email: null,
        phoneNumber: null,
        groupId: null,
        avatar: "",
      }),
      fullScreenLoading: false,
    };
  },
  methods: {
    async register() {
      this.fullScreenLoading = true;
      let url = import.meta.env.VITE_API + "/register";
      if (this.user.groupId) {
        url += "?groupId=" + this.user.groupId;
      }
      axios
        .post(url, this.user)
        .then((res) => {
          ElMessage({
            type: res.data.type,
            message: res.data.message,
          });
          router.push("/login");
        })
        .catch((e) => {
          ElMessage({
            type: "error",
            message: e.message,
          });
        })
        .finally(() => {
          this.fullScreenLoading = false;
        });
    },
  },
};
</script>

<style scoped>
.divider:after,
.divider:before {
  content: "";
  flex: 1;
  height: 1px;
  background: #eee;
}

.h-custom {
  height: calc(100% - 73px);
}

@media (max-width: 450px) {
  .h-custom {
    height: 100%;
  }
}
</style>
