<template>
  <div class="p-2" v-if="chat" style="position: relative; height: 100%">
    <div class="mt-2 d-flex">
      <chat-content-header :chat="chat" />
      <div style="margin-left: auto">
        <chat-add-button :chat="chat" @notify-user-joined="notifyUserJoined" />
      </div>
    </div>
    <hr />
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
        console.log(123);
        this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
      }
    },
    notifyUserJoined(listName) {
      this.chat.messages.push({
        type: "notify",
        content: listName + " đã tham gia cuộc trò chuyện",
      });
    },
    getChat(id) {
      axios.get(import.meta.env.VITE_CHAT_API + "/chat/" + id).then((res) => {
        this.chat = res.data;
      });
    },
  },
  created() {
    this.emitter.on("openChat", async (newChat) => {
      if (this.chat) {
        hub.RemoveFromChat(this.chat.id, this.user.userId);
      }
      this.chat = this.getChat(newChat.id);

      this.scrollToBottom();
      await hub.AddToChat(newChat.id);
    });
    hub.emitter.on("receiveMessage", (message) => {
      this.chat.messages.push(message);
      this.emitter.emit("updateLastMessage", { chatId: this.chat.id, message: message });
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
