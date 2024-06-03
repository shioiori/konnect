<template>
  <div>
    <el-tooltip content="Thay đổi vai trò" placement="top" effect="light">
      <el-button link type="warning" @click="dialogVisible = true">
        <el-icon>
          <Switch />
        </el-icon>
      </el-button>
    </el-tooltip>
    <el-dialog v-model="dialogVisible" title="Thay đổi vai trò" width="720">
      <div>
        <el-select v-model="role" placeholder="Select" style="width: 240px">
          <el-option
            v-for="item in roles"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div class="d-flex justify-content-end">
          <el-form-item>
            <el-button type="primary" @click="changeRole()"> Save </el-button>
            <el-button type="info" @click="dialogVisible = false">Cancel</el-button>
          </el-form-item>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { ElMessage } from "element-plus";
import { getHeaderConfig } from "../../utils/ApiHandler.js";

export default {
  props: {
    user: Object,
  },
  data() {
    return {
      dialogVisible: false,
      roles: [
        {
          value: "User",
          label: "Người dùng",
        },
        {
          value: "Manager",
          label: "Quản lý",
        },
      ],
      role: this.user.roleName,
    };
  },
  methods: {
    changeRole() {
      axios
        .post(
          import.meta.env.VITE_API + "/user/" + this.user.userName + "/" + this.role,
          {},
          getHeaderConfig()
        )
        .then((res) => {
          ElMessage({
            message: res.data.message,
            type: res.data.type,
          });
          this.user.roleName = this.role;
          this.dialogVisible = false;
        })
        .catch((e) => {
          ElMessage({
            type: "error",
            message: e.message,
          });
        });
    },
  },
};
</script>

<style></style>
