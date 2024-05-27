<template>
  <div>
    <el-button type="primary" plain @click="dialogVisible = true">Add group</el-button>
    <el-dialog v-model="dialogVisible" title="Thêm nhóm mới" width="720">
      <div class="py-4">
        <el-form :model="group" label-position="left" label-width="auto">
          <el-form-item label="Tên nhóm" required>
            <el-input v-model="group.name" />
          </el-form-item>
          <el-form-item label="Mời thành viên">
            <el-checkbox
              v-model="group.allowInvite"
              label="Cho phép thành viên mời người vào trong nhóm"
            />
          </el-form-item>
          <el-form-item label="Rời nhóm">
            <el-checkbox
              v-model="group.allowOut"
              label="Cho phép thành viên tự ý rời nhóm"
            />
          </el-form-item>
          <div class="d-flex justify-content-end">
            <el-button type="primary" @click="addGroup">Save</el-button>
            <el-button type="info" plain @click="dialogVisible = false">Close</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reactive } from "vue";
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";
import { ElMessage } from "element-plus";

export default {
  data() {
    return {
      dialogVisible: false,
      group: reactive({
        name: "New group",
        allowInvite: true,
        allowOut: true,
      }),
    };
  },
  methods: {
    addGroup() {
      axios
        .post(import.meta.env.VITE_API + "/group", this.group, getHeaderConfig())
        .then((res) => {
          ElMessage({
            message: res.data.message,
            type: res.data.type,
          });
          this.dialogVisible = false;
          this.$emit("getGroup");
        });
    },
  },
};
</script>

<style></style>
