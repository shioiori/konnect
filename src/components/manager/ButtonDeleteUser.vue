<template>
  <div>
    <el-button link type="danger" @click="removeUser">
      <el-icon>
        <Delete /> </el-icon
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
      ElMessageBox.confirm(
        "Bạn có chắc muốn xoá người dùng này ra khỏi nhóm?",
        "Warning",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      ).then(() => {
        console.log(this.index);
        console.log(this.user);
        axios
          .delete(
            import.meta.env.VITE_API + "/group/kick/" + this.user.userName,
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
