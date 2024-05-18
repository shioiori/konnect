<template>
  <div>
    <el-button type="danger" plain @click="outGroup">Out group</el-button>
  </div>
</template>

<script>
import axios from "axios";
import router from "../../router/index.ts";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  data() {
    return {};
  },
  methods: {
    outGroup() {
      ElMessageBox.confirm(
        "Bạn sẽ không thể truy cập group này được nữa. Tiếp tục?",
        "Warning",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          axios
            .delete(import.meta.env.VITE_API + "/group/out", getHeaderConfig())
            .then((res) => {
              ElMessage({
                message: res.data.message,
                type: res.data.type,
              });
              localStorage.setItem(import.meta.env.VITE_TOKEN_NAME, res.data.accessToken);
              router.push("/group");
            });
        })
        .catch((e) => {
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
