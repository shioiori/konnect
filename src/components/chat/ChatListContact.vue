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

export default {
  components: {
    ChatListContactSearch,
  },
  data() {
    return {
      chats: [],
    };
  },
  methods: {
    openChat(index) {},
    getSearchChat(searchName) {},
  },
};
</script>

<style></style>
