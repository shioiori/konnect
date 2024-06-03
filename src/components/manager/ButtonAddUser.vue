<template>
  <div>
    <el-button type="primary" plain @click="dialogVisible = true"
      >Thêm tài khoản vào nhóm</el-button
    >
    <el-dialog v-model="dialogVisible" title="User" width="720">
      <div class="py-4">
        <el-form :model="user" label-position="right" label-width="auto" ref="userForm">
          <el-form-item label="Username" prop="userName">
            <el-input v-model="user.userName" />
          </el-form-item>
          <el-form-item label="Name" prop="displayName">
            <el-input v-model="user.displayName" />
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="user.email" />
          </el-form-item>
          <el-form-item label="Phone" prop="phoneNumber">
            <el-input v-model="user.phoneNumber" />
          </el-form-item>
          <div class="text-end pb-3">
            <i class="text-muted"
              ><span class="text-danger">* </span>Lưu ý: Mật khẩu sẽ được đặt giống với
              tên đăng nhập</i
            >
          </div>
          <div class="d-flex justify-content-end">
            <el-form-item>
              <el-button type="primary" @click="addUser()"> Save </el-button>
              <el-button type="info" @click="dialogVisible = false">Cancel</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { ElMessage } from "element-plus";
import { reactive } from "vue";
import { getHeaderConfig } from "../../utils/ApiHandler.js";

export default {
  data() {
    return {
      dialogVisible: false,
      user: reactive({
        userName: null,
        password: null,
        displayName: null,
        email: null,
        phoneNumber: null,
        groupId: null,
        avatar: "",
      }),
    };
  },
  methods: {
    addUser() {
      axios
        .post(import.meta.env.VITE_API + "/user", this.user, getHeaderConfig())
        .then((res) => {
          ElMessage({
            message: res.data.message,
            type: res.data.type,
          });
          if (res.data.success) {
            this.$emit("addUser", res.data.user);
            this.dialogVisible = false;
          }
        })
        .catch((e) => {
          ElMessage({
            message: e.message,
            type: "error",
          });
        });
    },
    resetForm() {
      this.$refs["userForm"].resetFields();
    },
  },
};
</script>
<style lang=""></style>
