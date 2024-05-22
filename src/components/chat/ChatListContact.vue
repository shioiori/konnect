<template>
  <div>
    <chat-list-contact-search @search-chat="getSearchChat" />
    <el-menu class="el-menu-vertical-demo">
      <el-menu-item v-for="(chat, index) in chats" @click="openChat(chat)">
        <el-icon><el-avatar :src="chat.avatar" /></el-icon>
        <span>{{ chat.name }}</span>
        <div v-if="chat.messages.length > 0">{{ chat.messages[0].text }}</div>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import ChatListContactSearch from "./ChatListContactSearch.vue";
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";

export default {
  components: {
    ChatListContactSearch,
  },
  data() {
    return {
      chats: [],
      currentData: undefined,
    };
  },
  mounted() {
    this.getUser();
    this.emitter.on("insertChat", () => {
      this.getSearchChat();
    });
  },
  methods: {
    openChat(chat) {
      this.emitter.emit("openChat", chat);
    },
    getSearchChat(searchName) {
      if (searchName == undefined) searchName = "";
      axios
        .get(
          import.meta.env.VITE_CHAT_API +
            `/chat?groupId=${this.currentData.groupId}&userId=${this.currentData.userId}&name=${searchName}`
        )
        .then((res) => {
          this.chats = res.data;
        });
    },
    getUser() {
      axios.get(import.meta.env.VITE_API + "/user", getHeaderConfig()).then((res) => {
        this.currentData = res.data;
        this.getSearchChat();
      });
    },
  },
};
</script>

<style></style>
