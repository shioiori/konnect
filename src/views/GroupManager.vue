<template>
  <div>
    <div>
      <div class="justify-content-end d-flex">
        <el-button type="primary" plain @click="dialogUserVisible = true"
          >Import user</el-button
        >
        <el-button type="danger" plain @click="deleteGroup">Delete group</el-button>
      </div>
    </div>
    <div>
      <el-table :data="users" stripe style="width: 100%">
        <el-table-column prop="userName" label="Username" />
        <el-table-column prop="displayName" label="Display name" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="phone" label="Tel" />
        <el-table-column prop="roleName" label="Role" />
        <el-table-column fixed="right" label="Operations" width="120">
          <template #default>
            <el-button link type="warning" @click="editUser">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button link type="danger" @click="removeUser"
              ><el-icon><Delete /></el-icon
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="dialogUserVisible" title="Import users" width="720">
      <div class="text-center py-4">
        <IconImport @click="$refs.file.click()" />
        <h5>Select a file to import</h5>
        <p>
          Download template import
          <el-link
            type="primary"
            href="../assets/template/Import user template.xlsx"
            download
            >here</el-link
          >
        </p>
        <div>
          <input
            type="file"
            ref="file"
            @change="handleFileChange($event)"
            accept="image/*"
            capture
            hidden
          />
          <el-button type="primary" @click="$refs.file.click()">Import</el-button>
          <el-button type="info" plain @click="dialogUserVisible = false"
            >Close</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router/index.ts";
import IconImport from "../components/icons/import/IconImport.vue";
import IconButtonImport from "../components/icons/import/IconButtonImport.vue";
import { getHeaderConfig } from "../utils/ApiHandler.js";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  components: {
    IconImport,
    IconButtonImport,
  },
  data() {
    return {
      dialogUserVisible: false,
      users: [],
      fileUpload: undefined,
    };
  },
  mounted() {
    axios
      .get(import.meta.env.VITE_API + "/user", getHeaderConfig())
      .then((res) => {})
      .catch((err) => {
        ElMessage({
          message: "Không tìm thấy thông tin đăng nhập của người dùng",
          type: "error",
        });
        router.push("/login");
      });

    axios.get(import.meta.env.VITE_API + "/user/group", getHeaderConfig()).then((res) => {
      this.users = res.data;
    });
  },
  methods: {
    deleteGroup() {
      ElMessageBox.confirm("Nhóm này sẽ bị xoá vĩnh viễn. Tiếp tục?", "Warning", {
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          ElMessage({
            type: "success",
            message: "Delete completed",
          });
        })
        .catch((e) => {
          ElMessage({
            type: "error",
            message: e.message,
          });
        });
    },
    importUserToGroup() {
      var formData = new FormData();
      formData.append("image", this.fileUpload);
      axios
        .post(
          import.meta.env.VITE_API + "/import/user",
          {
            file: this.fileUpload,
          },
          getHeaderConfig("multipart/form-data")
        )
        .then((res) => {
          console.log(res);
          this.users = res.data;
          if (res.data.success) {
            ElMessage({
              message: "Import success.",
              type: "success",
            });
          } else {
            ElMessage({
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch((e) => {
          ElMessage({
            message: e.message,
            type: "error",
          });
        });
    },
    handleFileChange(event) {
      this.fileUpload = event.target.files[0];
      if (this.fileUpload) {
        this.importUserToGroup();
      }
      this.dialogImportVisible = false;
    },
  },
};
</script>

<style></style>
