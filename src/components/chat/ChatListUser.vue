<template>
  <div>
    <el-menu class="el-menu-vertical-demo" collapse>
      <el-menu-item v-for="(user, index) in users" class="px-3">
        <el-tooltip :content="user.displayName" placement="right" effect="light">
          <img
            class="img-responsive rounded-circle"
            :src="
              user.avatar ? user.avatar : '../../src/assets/images/avatar_default.png'
            "
            style="width: 100%"
            @click="createChat(user.userName)"
          />
        </el-tooltip>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";
export default {
  data() {
    return {
      users: [],
    };
  },
  mounted() {
    this.users = this.getUsers();
  },
  methods: {
    getUsers() {
      axios
        .get(import.meta.env.VITE_API + "/user/group", getHeaderConfig())
        .then((res) => {
          this.users = res.data.users;
        });
    },
    createChat(name) {
      axios
        .get(import.meta.env.VITE_API + "/chat/user/data?name=" + name, getHeaderConfig())
        .then((res) => {
          console.log(res.data);
          axios
            .get(import.meta.env.VITE_CHAT_API + "/chat/exist", res.data.users)
            .then((res) => {
              if (!res.data) {
                axios
                  .post(import.meta.env.VITE_CHAT_API + "/chat", res.data)
                  .then((res) => {
                    this.emitter.emit("insertChat");
                  });
              } else {
                this.emitter.emit("insertChat");
              }
            });
        });
    },
  },
};
</script>

<style></style>
