<template>
  <div class="p-2" v-if="chat" style="position: relative; height: 100%">
    <div class="mt-2 d-flex">
      <chat-content-header :chat="chat" />
      <div style="margin-left: auto">
        <chat-add-button :chat="chat" @notify-user-joined="notifyUserJoined" />
      </div>
    </div>
    <hr class="mt-2 mb-3" />
    <div class="pe-3 chat-content-container" ref="chatContainer">
      <chat-content-message
        :user="user"
        v-for="(message, index) in chat.messages"
        v-bind:message="message"
      />
    </div>
    <chat-content-input :chat="chat" :user="user" @receive-message="receiveMessage" />
  </div>
</template>

<script>
import ChatContentInput from "./ChatContentInput.vue";
import ChatContentMessage from "./ChatContentMessage.vue";
import ChatAddButton from "./ChatAddButton.vue";
import ChatContentHeader from "./ChatContentHeader.vue";
import hub from "../../hubs/chathub.js";
import { ref, nextTick } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
export default {
  components: {
    ChatContentInput,
    ChatContentMessage,
    ChatAddButton,
    ChatContentHeader,
  },
  data() {
    return {
      chat: undefined,
      chatContainer: undefined,
    };
  },
  props: {
    user: Object,
  },
  watch: {
    user(oldValue, newValue) {},
  },
  methods: {
    receiveMessage(message) {
      this.chat.messages.push(message);
    },
    scrollToBottom() {
      if (this.$refs.chatContainer) {
        this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
      }
    },
    notifyUserJoined(listName) {
      this.chat.messages.push({
        type: "notify",
        content: listName + " đã tham gia cuộc trò chuyện",
      });
    },
    async getChat(id) {
      var res = await axios.get(import.meta.env.VITE_CHAT_API + "/chat/" + id);
      this.chat = res.data;
    },
  },
  created() {
    hub.emitter.on("receiveMessage", (message) => {
      this.chat.messages.push(message);
      this.emitter.emit("updateLastMessage", { chatId: this.chat.id, message: message });
      nextTick(() => {
        this.scrollToBottom();
      });
    });

    this.emitter.on("openChat", async (newChat) => {
      if (this.chat) {
        hub.RemoveFromChat(this.chat.id, this.user.userId);
      }
      await this.getChat(newChat.id);
      await hub.AddToChat(newChat.id);
      nextTick(() => {
        this.scrollToBottom();
      });
    });
  },
};
</script>

<style>
.chat-content-container {
  overflow: auto;
  max-height: 31rem;
}
</style>
