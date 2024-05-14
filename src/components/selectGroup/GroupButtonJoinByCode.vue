<template>
  <div>
    <el-button type="primary" plain @click="dialogVisible = true"
      >Invite people</el-button
    >
    <el-dialog v-model="dialogVisible" title="Join group" width="720">
      <div class="py-4">
        Nhập mã group <el-input v-model="groupId" />
        <div class="d-flex justify-content-end">
          <el-button type="primary" @click="joinGroup">Join</el-button>
          <el-button type="info" plain @click="dialogVisible = false">Close</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import router from "../../router/index.ts";
import { ElMessage } from "element-plus";

export default {
  data() {
    return {
      groupId: "",
      dialogVisible: false,
    };
  },
  methods: {
    joinGroup() {
      axios
        .post(
          import.meta.env.VITE_API + "/group/join/" + this.groupId,
          {},
          getHeaderConfig()
        )
        .then((res) => {
          ElMessage({
            message: res.data.message,
            type: res.data.type,
          });
          localStorage.setItem(import.meta.env.VITE_TOKEN_NAME, res.data.accessToken);
          router.push("/");
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

<style></style>
