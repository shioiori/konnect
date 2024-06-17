<template>
  <div style="height: inherit">
    <el-menu
      class="el-menu-vertical-demo"
      collapse
      style="height: inherit; overflow: auto"
    >
      <el-menu-item v-for="(user, index) in users" class="px-3">
        <el-tooltip :content="user.displayName" placement="right" effect="light">
          <img
            class="img-responsive rounded-circle"
            :src="
              user.avatar ? user.avatar : '@/assets/images/avatar_default.png'
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
      addChatRequest: undefined,
    };
  },
  props: {
    user: Object,
  },
  watch: {
    user(oldValue, newValue) {
      this.users = this.getUsers();
    },
  },
  methods: {
    getUsers() {
      if (!this.user) return;
      axios
        .get(import.meta.env.VITE_API + "/user/group?isPaging=false", getHeaderConfig())
        .then((res) => {
          // console.log(res.data);
          // this.users = res.data.users;
          this.users = res.data.users.filter(
            (user) => user.userName != this.user.userName
          );
        });
    },
    createChat(name) {
      axios
        .get(import.meta.env.VITE_API + "/chat/data?name=" + name, getHeaderConfig())
        .then((res) => {
          this.addChatRequest = res.data;
          axios
            .get(
              import.meta.env.VITE_CHAT_API +
                "/chat/exist?json=" +
                JSON.stringify(res.data.users)
            )
            .then((res) => {
              console.log(res.data);
              if (!res.data) {
                axios
                  .post(import.meta.env.VITE_CHAT_API + "/chat", this.addChatRequest)
                  .then((res) => {
                    this.emitter.emit("insertChat");
                  });
              } else {
                this.emitter.emit("insertChat");
                this.emitter.emit("openChat", res.data);
              }
            });
        });
    },
  },
};
</script>

<style>
.chat-user-bar {
  border-right: 1px solid var(--Gray);
}

.chat-contact-bar {
  border-right: 1px solid var(--Gray);
}
</style>
