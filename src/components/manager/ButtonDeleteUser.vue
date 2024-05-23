<template>
  <div>
    <el-button link type="danger" @click="removeUser">
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
    removeUser() {
      ElMessageBox.confirm("Người dùng này sẽ bị xoá vĩnh viễn. Tiếp tục?", "Warning", {
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        console.log(this.index);
        console.log(this.user);
        axios
          .delete(
            import.meta.env.VITE_API + "/user/" + this.user.userName + "/kick",
            getHeaderConfig()
          )
          .then((res) => {
            ElMessage({
              message: res.data.message,
              type: res.data.type,
            });
            this.$emit("removeUser", this.index);
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
