<template>
  <div>
    <el-button link type="danger" @click="removeUser(scope.$index, scope.row.userName)">
      <el-icon> <Delete /> </el-icon
    ></el-button>
  </div>
</template>
<script>
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  props: {
    user: Object,
    index: Number,
  },
  methods: {
    removeUser(index, username) {
      ElMessageBox.confirm("Người dùng này sẽ bị xoá vĩnh viễn. Tiếp tục?", "Warning", {
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        console.log(index);
        console.log(username);
        axios
          .delete(import.meta.env.VITE_API + "/user/" + username, getHeaderConfig())
          .then((res) => {
            ElMessage({
              message: res.data.message,
              type: res.data.type,
            });
            this.users.splice(index, 1);
          })
          .catch((e) => {
            ElMessage({
              message: e.message,
              type: "error",
            });
          });
      });
    },
  },
};
</script>
<style lang=""></style>
