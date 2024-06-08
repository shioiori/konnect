<template>
  <div>
    <div class="d-flex">
      <div class="justify-content-start">
        <group-add-button action="edit" />
      </div>
      <div class="justify-content-end d-flex manager-button mb-2" style="flex: 1">
        <button-invite-user v-if="group && group.allowInvite" />
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
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :current-page="pageNumber"
          :page-size="pageSize"
          @current-change="onCurrentPageChange"
          @prev-click="onPrevClick"
          @next-click="onNextClick"
        />
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
import GroupAddButton from "../components/selectGroup/GroupAddButton.vue";

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
    GroupAddButton,
  },
  data() {
    return {
      users: [],
      currentUser: undefined,
      pageNumber: 1,
      pageSize: 12,
      total: 0,
      group: undefined,
    };
  },
  mounted() {
    this.getLoginUser();
    this.getUsers();
    this.getGroup();
  },
  methods: {
    getLoginUser() {
      axios.get(import.meta.env.VITE_API + "/user", getHeaderConfig()).then((res) => {
        this.currentUser = res.data;
      });
    },
    getUsers() {
      var url = import.meta.env.VITE_API + "/user/group?";
      url += "pageSize=" + this.pageSize;
      url += "&pageNumber=" + this.pageNumber;
      axios.get(url, getHeaderConfig()).then((res) => {
        this.users = res.data.users;
        this.total = res.data.total;
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
    onCurrentPageChange(page) {
      this.pageNumber = page;
      this.getUsers();
    },
    onNextClick() {
      let pageCount = Math.ceil(this.total / this.pageSize);
      if (this.pageNumber + 1 > pageCount) return;
      this.pageNumber += 1;
    },
    onPrevClick() {
      if (this.pageNumber - 1 <= 0) return;
      this.pageNumber -= 1;
    },
    getGroup() {
      axios.get(import.meta.env.VITE_API + "/group", getHeaderConfig()).then((res) => {
        this.group = res.data.group;
      });
    },
  },
};
</script>

<style>
.manager-button button {
  margin-left: 0.5rem;
}
</style>
