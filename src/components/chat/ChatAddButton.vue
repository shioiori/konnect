<template>
  <div>
    <div><i class="bi bi-person-add h3" @click="dialogVisible = true"></i></div>
    <el-dialog v-model="dialogVisible" title="Thêm thành viên" width="720">
      <div>
        <el-select
          class="mb-3"
          v-model="joinners"
          multiple
          collapse-tags
          max-collapse-tags="5"
          placeholder="Select"
        >
          <el-option
            v-for="item in users"
            :key="item.userName + '-' + item.displayName"
            :label="item.displayName"
            :value="item.userName"
          />
        </el-select>
        <div class="d-flex justify-content-end">
          <el-form-item>
            <el-button type="primary" @click="addUsersToGroup()"> Add </el-button>
            <el-button type="info" @click="dialogVisible = false">Cancel</el-button>
          </el-form-item>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";
import { ElMessage } from "element-plus";

export default {
  data() {
    return {
      dialogVisible: false,
      joinners: [],
      users: [],
    };
  },
  props: {
    chat: Object,
  },
  watch: {
    chat(oldValue, newValue) {},
  },
  mounted() {
    this.users = this.getUsers();
  },
  methods: {
    getUsers() {
      axios
        .get(import.meta.env.VITE_API + "/user/group", getHeaderConfig())
        .then((res) => {
          let usersInChat = this.chat.users.map((user) => user.userName);
          this.users = res.data.users.filter(
            (user) => !usersInChat.includes(user.userName)
          );
        });
    },
    addUsersToGroup() {
      var url = import.meta.env.VITE_API + "/chat/user/data?";
      var listName = "";
      this.joinners.forEach((userName) => {
        url += "userName=" + userName + "&";
        var user = this.users.find((x) => x.userName == userName);
        listName += user.displayName + ", ";
      });
      if (listName.length > 0) listName = listName.substring(0, listName.length - 2);
      this.users = this.users.filter((user) => !this.joinners.includes(user.userName));
      url = url.slice(0, -1);
      axios.get(url, getHeaderConfig()).then((res) => {
        let userDatas = res.data;
        console.log(userDatas);
        axios
          .post(import.meta.env.VITE_CHAT_API + "/chat/join", {
            id: this.chat.id,
            users: userDatas,
          })
          .then((res) => {
            ElMessage({
              type: "success",
              message: "Thêm người dùng thành công",
            });
            this.dialogVisible = false;
            this.$emit("notifyUserJoined", listName);
            this.joinners = [];
            this.getUsers();
          });
      });
    },
  },
};
</script>

<style></style>
