<template>
  <div class="chat mt-2" style="width: 100%">
    <el-row style="height: inherit">
      <el-col :span="1" style="height: inherit"> <chat-list-user :user="user" /> </el-col>
      <el-col
        :span="6"
        style="height: inherit; border-right: 1px solid var(--Gray)"
        class="pe-3 ms-4 me-3"
      >
        <chat-list-contact :user="user" />
      </el-col>
      <el-col :span="16">
        <chat-content :user="user" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ChatContent from "../components/chat/ChatContent.vue";
import ChatListContact from "../components/chat/ChatListContact.vue";
import ChatListUser from "../components/chat/ChatListUser.vue";

import axios from "axios";
import { getHeaderConfig } from "../utils/ApiHandler.js";
import hub from "../hubs/chathub.js";

export default {
  components: {
    ChatContent,
    ChatListContact,
    ChatListUser,
  },
  data() {
    return {
      user: undefined,
    };
  },
  created() {
    this.getUser();
    hub.onConnectionAsync();
  },
  methods: {
    getUser() {
      axios.get(import.meta.env.VITE_API + "/user", getHeaderConfig()).then((res) => {
        this.user = res.data;
      });
    },
  },
};
</script>

<style>
.chat {
  height: 85vh;
  border: 1px solid var(--Gray);
  border-radius: 0.25rem;
  overflow: hidden;
}
</style>
