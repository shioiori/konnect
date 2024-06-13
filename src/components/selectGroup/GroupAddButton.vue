<template>
  <div>
    <div class="text-end">
      <el-button
        type="primary"
        plain
        @click="dialogVisible = true"
        :icon="icon"
        v-if="action == 'edit'"
      ></el-button>
      <el-button
        type="primary"
        plain
        @click="dialogVisible = true"
        v-if="action != 'edit'"
        >{{ this.title }}</el-button
      >
    </div>
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
            <el-button
              type="primary"
              @click="
                if (action == 'edit') {
                  editGroup();
                } else {
                  addGroup();
                }
              "
              >Save</el-button
            >
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
import { Setting } from "@element-plus/icons-vue";
export default {
  data() {
    return {
      dialogVisible: false,
      group: reactive({
        id: null,
        name: "New group",
        allowInvite: true,
        allowOut: true,
      }),
      title: "Tạo nhóm",
      icon: null,
    };
  },
  props: {
    action: String,
  },
  mounted() {
    console.log(this.action);
    if (this.action == "edit") {
      this.title = "";
      this.icon = Setting;
      this.getGroup();
    }
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
    getGroup() {
      axios.get(import.meta.env.VITE_API + "/group", getHeaderConfig()).then((res) => {
        this.group = res.data.group;
      });
    },
    editGroup() {
      axios
        .post(
          import.meta.env.VITE_API + "/group/" + this.group.id,
          this.group,
          getHeaderConfig()
        )
        .then((res) => {
          ElMessage({
            message: res.data.message,
            type: res.data.type,
          });
          this.$emit("refreshGroup");
          this.dialogVisible = false;
          this.$emit("getGroup");
        });
    },
  },
};
</script>

<style></style>
