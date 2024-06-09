<template>
  <div>
    <el-button type="primary" plain @click="dialogVisible = true">{{
      this.buttonText
    }}</el-button>
    <el-dialog v-model="dialogVisible" :title="title" width="720">
      <div class="py-4">
        <el-form :model="user" label-position="right" label-width="auto" ref="userForm">
          <el-form-item label="Username" prop="userName" v-if="action == 'add'" required>
            <el-input v-model="user.userName" />
          </el-form-item>
          <el-form-item label="Name" prop="displayName" required>
            <el-input v-model="user.displayName" />
          </el-form-item>
          <el-form-item label="Email" prop="email" required>
            <el-input v-model="user.email" />
          </el-form-item>
          <el-form-item label="Phone" prop="phoneNumber">
            <el-input v-model="user.phoneNumber" />
          </el-form-item>
          <div class="text-end pb-3" v-if="action == 'add'">
            <i class="text-muted"
              ><span class="text-danger">* </span>Lưu ý: Mật khẩu sẽ được đặt giống với
              tên đăng nhập</i
            >
          </div>
          <div class="d-flex justify-content-end">
            <el-form-item>
              <el-button type="primary" @click="onSubmit()"> Save </el-button>
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
  props: {
    action: String,
    title: String,
    buttonText: String,
    editUser: Object,
  },
  watch: {
    editUser(oldValue, newValue) {
      this.user = this.editUser;
      console.log(this.user);
    },
  },
  methods: {
    onSubmit() {
      if (this.action == "add") {
        this.addUser();
      }
      if (this.action == "edit") {
        this.updateUser();
      }
    },
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
    updateUser() {
      axios
        .post(
          import.meta.env.VITE_API + "/user/" + this.user.userName,
          this.user,
          getHeaderConfig()
        )
        .then((res) => {
          ElMessage({
            message: res.data.message,
            type: res.data.type,
          });
          if (res.data.success) {
            this.$emit("editUser", res.data.user);
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
  },
};
</script>
<style lang=""></style>
