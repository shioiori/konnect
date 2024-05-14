<template>
  <el-card shadow="hover" @click="loginWithGroup">
    <template #header :style="'background-color: ' + color">{{ group.name }}</template>
  </el-card>
</template>

<script>
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";
import router from "../../router/index.ts";

export default {
  data() {
    return {
      color: "#ffffff",
    };
  },
  props: {
    group: Object,
  },
  created() {
    this.color = this.getRandomColor();
  },
  methods: {
    getRandomColor() {
      var letters = "0123456789ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    async loginWithGroup() {
      axios
        .post(import.meta.env.VITE_API + "/login/" + this.group.id, getHeaderConfig())
        .then((res) => {
          ElMessage({
            message: "Chào mừng quay trở lại",
            type: "success",
          });
          localStorage.setItem(import.meta.env.VITE_TOKEN_NAME, res.data.accessToken);
          router.push("/");
        })
        .catch((err) => {
          localStorage.setItem(import.meta.env.VITE_TOKEN_NAME, "");
          router.push("/login");
        });
    },
  },
};
</script>

<style></style>
