<template>
  <div>
    <el-button type="primary" plain @click="dialogVisible = true"
      >Change password</el-button
    >
    <el-dialog v-model="dialogVisible" title="Thay dodoi" width="720">
      <div>
        <el-form
          label-position="right"
          label-width="auto"
          :model="passwordConfirmation"
          ref="passwordConfirmation"
          status-icon
          :rules="rules"
        >
          <el-form-item label="Mật khẩu cũ" prop="oldPassword">
            <el-input
              v-model="passwordConfirmation.oldPassword"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item label="Mật khẩu mới" prop="newPassword">
            <el-input
              v-model="passwordConfirmation.newPassword"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item label="Xác nhận mật khẩu" prop="newPasswordConfirm">
            <el-input
              v-model="passwordConfirmation.newPasswordConfirm"
              type="password"
              show-password
            />
          </el-form-item>
          <div class="text-end">
            <el-button type="primary" plain @click="submitForm">Change</el-button>
            <el-button type="info" plain @click="dialogVisible = false">Close</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";
import { ElMessage } from "element-plus";

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Hãy nhập mật khẩu"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Hãy xác nhận mật khẩu"));
      } else if (value !== this.passwordConfirmation.newPassword) {
        callback(new Error("Mật khẩu không khớp"));
      } else {
        callback();
      }
    };
    return {
      passwordConfirmation: {
        oldPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
      },
      rules: {
        oldPassword: [{ validator: validatePass, trigger: "blur" }],
        newPassword: [{ validator: validatePass, trigger: "blur" }],
        newPasswordConfirm: [{ validator: validatePass2, trigger: "blur" }],
      },
      dialogVisible: false,
    };
  },
  methods: {
    changePassword() {
      axios
        .post(
          import.meta.env.VITE_API + "/password/change",
          this.passwordConfirmation,
          getHeaderConfig()
        )
        .then((res) => {
          ElMessage({
            type: res.data.type,
            message: res.data.message,
          });
        })
        .catch((e) => {
          ElMessage({
            type: "error",
            message: e.message,
          });
        });
    },
    submitForm() {
      this.$refs["passwordConfirmation"].validate((valid) => {
        if (valid) {
          this.changePassword();
        } else {
          alert("submit!");
          return false;
        }
      });
    },
  },
};
</script>

<style></style>
