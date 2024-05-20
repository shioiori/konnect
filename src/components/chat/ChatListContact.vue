<template>
  <div>
    <chat-list-contact-search @search-chat="getSearchChat" />
    <el-menu class="el-menu-vertical-demo">
      <el-menu-item v-for="(chat, index) in chats" @click="openChat(index)">
        <el-icon><img /></el-icon>
        <span>Navigator Four</span>
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
  mounted() {},
  methods: {
    openChat(index) {},
    getSearchChat(searchName) {
      axios
        .post(
          import.meta.env.VITE_CHAT_API +
            `/chat?groupId=${this.currentData.groupId}&userId=${this.currentData.userId}`,
          {
            content: comment,
          },
          getHeaderConfig()
        )
        .then((res) => {
          console.log(res.data);
          console.log(this.post.comments[0]);
          this.post.comments.push(res.data.comment);
        });
    },
    getUsers() {
      axios.get(import.meta.env.VITE_API + "/user", getHeaderConfig()).then((res) => {
        this.currentData = res.data;
      });
    },
  },
};
</script>

<style></style>
