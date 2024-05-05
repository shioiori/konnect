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
          <form>
            <div
              class="d-flex flex-row align-items-center justify-content-center justify-content-lg-start"
            >
              <p class="lead fw-normal mb-0 me-1">Sign in with</p>
              <button
                type="button"
                data-mdb-button-init
                data-mdb-ripple-init
                class="btn btn-outline-danger btn-floating mx-1"
              >
                <i class="bi bi-google"></i> Google
              </button>
            </div>

            <div class="divider d-flex align-items-center my-4">
              <p class="text-center fw-bold mx-3 mb-0">or</p>
            </div>

            <!-- Email input -->
            <div data-mdb-input-init class="form-outline mb-4">
              <label class="form-label" for="form3Example3">Username</label>
              <input
                type="text"
                v-model="username"
                id="form3Example3"
                class="form-control"
                placeholder="Enter username"
              />
            </div>

            <!-- Password input -->
            <div data-mdb-input-init class="form-outline mb-3">
              <label class="form-label" for="form3Example4">Password</label>
              <input
                type="password"
                v-model="password"
                id="form3Example4"
                class="form-control"
                placeholder="Enter password"
              />
            </div>

            <div class="d-flex justify-content-between align-items-center">
              <!-- Checkbox -->
              <div class="form-check mb-0">
                <input
                  class="form-check-input me-2"
                  type="checkbox"
                  value=""
                  id="form2Example3"
                />
                <label class="form-check-label" for="form2Example3"> Remember me </label>
              </div>
              <a href="" class="text-body link-underline-opacity-0">Forgot password?</a>
            </div>

            <div class="text-center text-lg-start mt-4 pt-2">
              <button
                type="button"
                data-mdb-button-init
                data-mdb-ripple-init
                class="btn btn-primary"
                style="padding-left: 2.5rem; padding-right: 2.5rem"
                @click="login"
              >
                Login
              </button>
              <p class="small fw-bold mt-2 pt-1 mb-0">
                Don't have an account?
                <a href="/register" class="link-danger link-underline-opacity-0"
                  >Register</a
                >
              </p>
            </div>
          </form>
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

export default {
  data() {
    return {
      username: null,
      password: null,
    };
  },
  mounted() {
    // var token = localStorage.getItem(import.meta.env.VITE_TOKEN_NAME);
    // if (token != null && token != '') {
    //     router.push('/group');
    //     return;
    // }
  },
  methods: {
    async login() {
      axios
        .post(import.meta.env.VITE_API + "/login", {
          username: this.username,
          password: this.password,
        })
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            ElMessage({
              message: "Đăng nhập thành công",
              type: "success",
            });
            localStorage.setItem(import.meta.env.VITE_TOKEN_NAME, res.data.accessToken);
            router.push("/group");
          } else {
            ElMessage({
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch((e) => {
          console.error(e.message);
          ElMessage({
            message: e.message,
            type: "error",
          });
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

body {
  padding: 0;
}

@media screen and (min-width: 768px) {
  body {
    padding-left: 0;
  }
}

@media (max-width: 450px) {
  .h-custom {
    height: 100%;
  }
}
</style>
