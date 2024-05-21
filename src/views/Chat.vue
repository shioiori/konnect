<template>
  <div class="chat">
    <el-row style="height: inherit">
      <el-col :span="2"> <chat-list-user /> </el-col>
      <el-col :span="4">
        <chat-list-contact />
      </el-col>
      <el-col :span="18">
        <chat-content />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ChatContent from "../components/chat/ChatContent.vue";
import ChatListContact from "../components/chat/ChatListContact.vue";
import ChatListUser from "../components/chat/ChatListUser.vue";

export default {
  components: {
    ChatContent,
    ChatListContact,
    ChatListUser,
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
