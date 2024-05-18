<template>
  <div class="user-infomation">
    <el-row :gutter="20">
      <el-col :span="6">
        <div><user-avatar :user="user" /></div
      ></el-col>
      <el-col :span="18">
        <el-descriptions
          class="margin-top"
          title="Thông tin cá nhân"
          :column="1"
          size="default"
          border
        >
          <!-- <template #extra>
      <el-button type="primary">Operation</el-button>
    </template> -->
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                Username
              </div>
            </template>
            {{ user.userName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <office-building />
                </el-icon>
                Password
              </div>
            </template>
            <div class="d-flex">
              <span class="me-2">************</span>
              <user-change-password-button />
            </div>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <tickets />
                </el-icon>
                Display name
              </div>
            </template>
            {{ user.displayName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <iphone />
                </el-icon>
                Telephone
              </div>
            </template>
            {{ user.phoneNumber }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <location />
                </el-icon>
                Email
              </div>
            </template>
            <div class="d-flex">
              <span class="me-2">{{ user.email }}</span>
              <user-mail-confirmation-button :isConfirm="emailConfirmed" />
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import UserChangePasswordButton from "@/components/user/UserChangePasswordButton.vue";
import UserMailConfirmationButton from "@/components/user/UserMailConfirmationButton.vue";
import UserAvatar from "@/components/user/UserAvatar.vue";

import axios from "axios";
import { getHeaderConfig } from "../utils/ApiHandler.js";
import { ElMessage } from "element-plus";

export default {
  components: {
    UserChangePasswordButton,
    UserMailConfirmationButton,
    UserAvatar,
  },
  data() {
    return {
      user: {},
      emailConfirmed: false,
    };
  },
  mounted() {
    this.getCurrentUser();
    this.checkEmailConfirmed();
  },
  methods: {
    getCurrentUser() {
      axios.get(import.meta.env.VITE_API + "/user", getHeaderConfig()).then((res) => {
        this.user = res.data;
        console.log(res.data);
      });
    },
    checkEmailConfirmed() {
      axios
        .get(import.meta.env.VITE_API + "/user/check-email-confirmed", getHeaderConfig())
        .then((res) => {
          this.emailConfirmed = res.data;
          console.log(res.data);
        });
    },
  },
};
</script>

<style>
.user-infomation span {
  display: flex;
  align-items: center;
}
</style>
