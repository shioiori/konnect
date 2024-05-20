<template>
  <div>
    <div>
      <div class="justify-content-end d-flex">
        <button-manager-invite />
        <button-import-user @get-users="getUsers" />
        <div>
          <el-button type="primary" plain @click="updateAction('add')"
            >Add user</el-button
          >
        </div>
        <button-delete-group />
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
              <button-edit-user
                :user="scope.row"
                :index="scope.$index"
                @add-user="addUser"
              />
              <button-delete-user :user="scope.row" :index="scope.$index" />
            </div>
          </template>
        </el-table-column>
      </el-table>
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
import ButtonEditUser from "../components/manager/ButtonEditUser.vue";
import ButtonDeleteUser from "../components/manager/ButtonDeleteUser.vue";
import ButtonImportUser from "../components/manager/ButtonImportUser.vue";
import ButtonInviteUser from "../components/manager/ButtonInviteUser.vue";
import ButtonDeleteGroup from "../components/manager/ButtonDeleteGroup.vue";

export default {
  components: {
    IconImport,
    IconButtonImport,
    ButtonChangeRole,
    ButtonEditUser,
    ButtonDeleteUser,
    ButtonImportUser,
    ButtonInviteUser,
    ButtonDeleteGroup,
  },
  data() {
    return {
      users: [],
      action: "add",
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      axios
        .get(import.meta.env.VITE_API + "/user/group", getHeaderConfig())
        .then((res) => {
          this.users = res.data.users;
        });
    },
    updateAction(act) {
      this.action = act;
    },
    addUser(user) {
      this.users.push(user);
    },
  },
};
</script>

<style></style>
