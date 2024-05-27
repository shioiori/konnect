<template>
  <el-col :span="8">
    <el-card shadow="hover" @click="loginWithGroup" class="group-item">
      <template #header>
        <span ref="groupTitle">
          {{ group.name }}
        </span>
      </template>
    </el-card></el-col
  >
</template>

<script>
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";
import { getRandomColor } from "../../utils/RandomHandler.js";
import router from "../../router/index.ts";

export default {
  data() {
    return {};
  },
  props: {
    group: Object,
  },
  mounted() {
    this.$refs.groupTitle.closest("div").style.background = getRandomColor();
    console.log(this.$refs.groupTitle.closest("div").style);
  },
  methods: {
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

<style>
.group-item span {
  color: var(--White);
  mix-blend-mode: difference;
}
</style>
