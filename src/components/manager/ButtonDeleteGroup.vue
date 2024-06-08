<template>
  <div>
    <el-button type="danger" plain @click="deleteGroup">Xoá nhóm</el-button>
  </div>
</template>
<script>
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";
import { ElMessage, ElMessageBox } from "element-plus";
import router from "../../router/index.ts";

export default {
  methods: {
    deleteGroup() {
      ElMessageBox.confirm("Nhóm của bạn sẽ biến mất vĩnh viễn. Tiếp tục?", "Warning", {
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          axios
            .delete(import.meta.env.VITE_API + "/group", getHeaderConfig())
            .then((res) => {
              ElMessage({
                message: "Nhóm của bạn đã được xoá",
                type: "success",
              });
              localStorage.setItem(import.meta.env.VITE_TOKEN_NAME, res.data.accessToken);
              router.push("/group");
            });
        })
        .catch((e) => {});
    },
  },
};
</script>
<style></style>
