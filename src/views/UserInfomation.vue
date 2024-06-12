<template>
  <div class="user-infomation">
    <div class="d-flex mb-2">
      <div class="info-btn-container text-end d-flex" style="margin-left: auto">
        <button-add-user
          :editUser="user"
          action="edit"
          title="Chỉnh sửa thông tin"
          buttonText="Chỉnh sửa thông tin"
          @edit-user="editUser"
        />
        <user-change-password-button />
      </div>
    </div>
    <el-row>
      <el-col :span="4">
        <div><user-avatar :user="user" @update-avatar="updateAvatar" /></div>
      </el-col>
      <el-col :span="20">
        <el-descriptions class="margin-top" :column="1" size="default" border>
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
          <!-- <el-descriptions-item>
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
          </el-descriptions-item> -->
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
              <!-- <user-mail-confirmation-button :isConfirm="emailConfirmed" /> -->
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
import ButtonAddUser from "@/components/manager/ButtonAddUser.vue";

import axios from "axios";
import { getHeaderConfig } from "../utils/ApiHandler.js";
import { ElMessage } from "element-plus";

export default {
  components: {
    UserChangePasswordButton,
    UserMailConfirmationButton,
    UserAvatar,
    ButtonAddUser,
  },
  data() {
    return {
      user: {},
      emailConfirmed: false,
    };
  },
  mounted() {
    this.getCurrentUser();
    //this.checkEmailConfirmed();
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
    editUser(user) {
      this.user = user;
    },
    updateAvatar(url) {
      this.user.avatar = url;
    },
  },
};
</script>

<style>
.user-infomation span {
  display: flex;
  align-items: center;
}

.info-btn-container button {
  margin-left: 0.5rem;
}
</style>
