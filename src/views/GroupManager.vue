<template>
  <div>
    <div>
      <div class="justify-content-end d-flex manager-button mb-2">
        <button-invite-user />
        <div class="d-flex" v-if="currentUser && currentUser.roleName == 'Manager'">
          <button-import-user @get-users="getUsers" />
          <button-add-user @add-user="addUser" />
          <button-delete-group />
        </div>
      </div>
    </div>
    <div>
      <el-table :data="users" stripe style="width: 100%">
        <el-table-column prop="userName" label="Username" />
        <el-table-column prop="displayName" label="Display name" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="phoneNumber" label="Tel" />
        <el-table-column prop="roleName" label="Role">
          <template #default="scope">
            <el-tag type="warning" disable-transitions>{{ scope.row.roleName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="Operations"
          width="120"
          v-if="currentUser && currentUser.roleName == 'Manager'"
        >
          <template #default="scope">
            <div class="d-flex">
              <button-change-role :user="scope.row" />
              <!-- <button-edit-user
                :user="scope.row"
                :index="scope.$index"
                @add-user="addUser"
              /> -->
              <button-delete-user
                :user="scope.row"
                :index="scope.$index"
                @remove-user="removeUser"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="d-flex justify-content-end mt-2">
        <el-pagination background layout="prev, pager, next" :total="20" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router/index.ts";
import IconImport from "../components/icons/import/IconImport.vue";
import IconButtonImport from "../components/icons/import/IconButtonImport.vue";
import { getHeaderConfig } from "../utils/ApiHandler.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { Picture as IconPicture } from "@element-plus/icons-vue";
import ButtonChangeRole from "../components/manager/ButtonChangeRole.vue";
//import ButtonEditUser from "../components/manager/ButtonEditUser.vue";
import ButtonAddUser from "../components/manager/ButtonAddUser.vue";
import ButtonDeleteUser from "../components/manager/ButtonDeleteUser.vue";
import ButtonImportUser from "../components/manager/ButtonImportUser.vue";
import ButtonInviteUser from "../components/manager/ButtonInviteUser.vue";
import ButtonDeleteGroup from "../components/manager/ButtonDeleteGroup.vue";

export default {
  components: {
    IconImport,
    IconButtonImport,
    ButtonChangeRole,
    //ButtonEditUser,
    ButtonAddUser,
    ButtonDeleteUser,
    ButtonImportUser,
    ButtonInviteUser,
    ButtonDeleteGroup,
  },
  data() {
    return {
      users: [],
      currentUser: undefined,
    };
  },
  mounted() {
    this.getLoginUser();
    this.getUsers();
  },
  methods: {
    getLoginUser() {
      axios.get(import.meta.env.VITE_API + "/user", getHeaderConfig()).then((res) => {
        this.currentUser = res.data;
      });
    },
    getUsers() {
      axios
        .get(import.meta.env.VITE_API + "/user/group", getHeaderConfig())
        .then((res) => {
          this.users = res.data.users;
        });
    },
    updateAction() {
      this.emitter.emit("changeAction", "add");
    },
    addUser(user) {
      this.users.push(user);
    },
    removeUser(index) {
      this.users.splice(index, 1);
    },
  },
};
</script>

<style>
.manager-button button {
  margin-left: 0.5rem;
}
</style>
