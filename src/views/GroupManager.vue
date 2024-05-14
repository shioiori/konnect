<template>
  <div>
    <div>
      <div class="justify-content-end d-flex">
        <button-manager-invite class="mx-2" />
        <el-button type="primary" plain @click="dialogImportVisible = true"
          >Import user</el-button
        >
        <el-button
          type="primary"
          plain
          @click="
            dialogAddVisible = true;
            action = 'add';
            clearDialog();
          "
          >Add user</el-button
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
            <el-button link type="warning" @click="bindUserToDialog(userName)">
              <el-icon>
                <Edit />
              </el-icon>
            </el-button>
            <el-button link type="danger" @click="removeUser(index, userName)">
              <el-icon>
                <Delete /> </el-icon
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="dialogImportVisible" title="Import users" width="720">
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
          <el-button type="info" plain @click="dialogImportVisible = false"
            >Close</el-button
          >
        </div>
      </div>
    </el-dialog>
    <el-dialog v-model="dialogAddVisible" title="User" width="720">
      <div class="py-4">
        <el-form :model="event">
          <el-form-item label="Username" prop="username" required v-if="action == 'add'">
            <el-input v-model="user.username" />
          </el-form-item>
          <el-form-item label="Password" prop="password" required v-if="action == 'add'">
            <el-input v-model="user.password" type="password" show-password />
          </el-form-item>
          <el-form-item label="Name" prop="name" required>
            <el-input v-model="user.name" />
          </el-form-item>
          <el-form-item label="Email" prop="email" required>
            <el-input v-model="user.email" />
          </el-form-item>
          <el-form-item label="Phone" prop="phone" required>
            <el-input v-model="user.phone" />
          </el-form-item>
          <div class="d-flex justify-content-end">
            <el-form-item>
              <el-button type="primary" @click="addUser"> Save </el-button>
              <el-button type="info" @click="dialogAddVisible = false">Cancel</el-button>
            </el-form-item>
          </div>
        </el-form>
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
import { reactive } from "vue";
import ButtonManagerInvite from "../components/manager/ButtonManagerInvite.vue";

export default {
  components: {
    IconImport,
    IconButtonImport,
    ButtonManagerInvite,
  },
  data() {
    return {
      dialogImportVisible: false,
      dialogAddVisible: false,
      users: [],
      fileUpload: undefined,
      user: reactive({
        username: "",
        password: "",
        name: "",
        email: "",
        phone: "",
        avatar: "",
      }),
      action: "add",
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
          ElMessage({
            message: res.data.message,
            type: res.data.type,
          });
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
    bindUserToDialog(username) {
      this.dialogAddVisible = true;
      this.action = "edit";
      var currentUser = this.users.find((x) => x.username == username);
      this.user = {
        name: currentUser.displayName,
        email: currentUser.email,
        phone: currentUser.password,
      };
      console.log(this.users.find((x) => x.username == username));
    },
    clearDialog() {
      this.user = {
        username: "",
        password: "",
        name: "",
        email: "",
        phone: "",
        avatar: "",
      };
    },
    editUser(index, username) {
      axios
        .post(import.meta.env.VITE_API + "/user/" + username, {}, getHeaderConfig())
        .then((res) => {
          ElMessage({
            message: res.data.message,
            type: res.data.type,
          });
          this.users[index] = res.data;
        })
        .catch((e) => {
          ElMessage({
            message: e.message,
            type: "error",
          });
        });
    },
    removeUser(username) {
      ElMessageBox.confirm("Người dùng này sẽ bị xoá vĩnh viễn. Tiếp tục?", "Warning", {
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        axios
          .delete(import.meta.env.VITE_API + "/user/" + username, {}, getHeaderConfig())
          .then((res) => {
            ElMessage({
              message: res.data.message,
              type: res.data.type,
            });
          })
          .catch((e) => {
            ElMessage({
              message: e.message,
              type: "error",
            });
          });
      });
    },
    addUser() {
      axios
        .post(import.meta.env.VITE_API + "/user", {}, getHeaderConfig())
        .then((res) => {
          ElMessage({
            message: res.data.message,
            type: res.data.type,
          });
          this.users.push(res.data);
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

<style></style>
