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
        <el-table-column prop="roleName" label="Role">
          <template #default="scope">
            <el-tag type="warning" disable-transitions>{{ scope.row.roleName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Operations" width="120">
          <template #default="scope">
            <div class="d-flex">
              <button-change-role :user="scope.row" />
              <el-button
                link
                type="warning"
                @click="bindUserToDialog(userName, scope.$index)"
              >
                <el-icon>
                  <Edit />
                </el-icon>
              </el-button>
              <el-button
                link
                type="danger"
                @click="removeUser(scope.$index, scope.row.userName)"
              >
                <el-icon> <Delete /> </el-icon
              ></el-button>
            </div>
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
        <el-form :model="event" label-position="right" label-width="auto">
          <el-form-item prop="avatar" v-if="user.avatar">
            <el-image :src="user.avatar">
              <template #error>
                <div class="image-slot">
                  <el-icon><icon-picture /></el-icon>
                </div>
              </template>
            </el-image>
          </el-form-item>
          <el-form-item label="Username" prop="userName" v-if="action == 'add'">
            <el-input v-model="user.userName" />
          </el-form-item>
          <el-form-item label="Name" prop="displayName">
            <el-input v-model="user.displayName" />
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="user.email" />
          </el-form-item>
          <el-form-item label="Phone" prop="phoneNumber">
            <el-input v-model="user.phoneNumber" />
          </el-form-item>
          <div class="text-end pb-3" v-if="action == 'add'">
            <i class="text-muted"
              ><span class="text-danger">* </span>Lưu ý: Mật khẩu sẽ được đặt giống với
              username</i
            >
          </div>
          <div class="d-flex justify-content-end">
            <el-form-item>
              <el-button type="primary" @click="saveUser()"> Save </el-button>
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
import { Picture as IconPicture } from "@element-plus/icons-vue";
import ButtonChangeRole from "../components/manager/ButtonChangeRole.vue";
export default {
  components: {
    IconImport,
    IconButtonImport,
    ButtonManagerInvite,
    ButtonChangeRole,
  },
  data() {
    return {
      dialogImportVisible: false,
      dialogAddVisible: false,
      users: [],
      fileUpload: undefined,
      user: reactive({
        userName: "",
        displayName: "",
        email: "",
        phoneNumber: "",
        avatar: "",
      }),
      action: "add",
      currentIndex: 0,
    };
  },
  mounted() {
    axios.get(import.meta.env.VITE_API + "/user/group", getHeaderConfig()).then((res) => {
      this.users = res.data.users;
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
    bindUserToDialog(username, index) {
      this.dialogAddVisible = true;
      this.action = "edit";
      var currentUser = this.users.find((x) => x.username == username);
      this.user = {
        displayName: currentUser.displayName,
        email: currentUser.email,
        phoneNumber: currentUser.phoneNumber,
        avatar: currentUser.avatar,
      };
      this.currentIndex = index;
    },
    clearDialog() {
      this.user = {
        userName: "",
        displayName: "",
        email: "",
        phoneNumber: "",
        avatar: "",
      };
      this.index = 0;
    },
    editUser() {
      axios
        .post(
          import.meta.env.VITE_API + "/user/" + this.users[this.currentIndex].userName,
          this.user,
          getHeaderConfig()
        )
        .then((res) => {
          ElMessage({
            message: res.data.message,
            type: res.data.type,
          });
          this.users[this.currentIndex].displayName = this.user.displayName;
          this.users[this.currentIndex].email = this.user.email;
          this.users[this.currentIndex].phoneNumber = this.user.phoneNumber;
          this.dialogAddVisible = false;
        })
        .catch((e) => {
          ElMessage({
            message: e.message,
            type: "error",
          });
        });
    },
    removeUser(index, username) {
      ElMessageBox.confirm("Người dùng này sẽ bị xoá vĩnh viễn. Tiếp tục?", "Warning", {
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        console.log(index);
        console.log(username);
        axios
          .delete(import.meta.env.VITE_API + "/user/" + username, getHeaderConfig())
          .then((res) => {
            ElMessage({
              message: res.data.message,
              type: res.data.type,
            });
            this.users.splice(index, 1);
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
        .post(import.meta.env.VITE_API + "/user", this.user, getHeaderConfig())
        .then((res) => {
          ElMessage({
            message: res.data.message,
            type: res.data.type,
          });
          this.users.push(res.data.user);
          this.dialogAddVisible = false;
        })
        .catch((e) => {
          ElMessage({
            message: e.message,
            type: "error",
          });
        });
    },
    saveUser() {
      if (this.action == "add") {
        this.addUser();
      } else {
        this.editUser();
      }
    },
  },
};
</script>

<style></style>
