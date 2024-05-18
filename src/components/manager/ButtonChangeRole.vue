<template>
  <div>
    <el-tooltip content="Change role" placement="top" effect="light">
      <el-button link type="warning" @click="dialogVisible = true">
        <el-icon>
          <Switch />
        </el-icon>
      </el-button>
    </el-tooltip>
    <el-dialog v-model="dialogVisible" title="Change role" width="720">
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
            <el-button type="info" @click="dialogAddVisible = false">Cancel</el-button>
          </el-form-item>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
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
    changeRole() {},
  },
};
</script>

<style></style>
