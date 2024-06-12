<template>
  <div class="p-2" v-if="chat" style="position: relative; height: 100%">
    <div class="mt-2 d-flex">
      <h4>{{ chat.name }}</h4>
      <div style="margin-left: auto">
        <chat-add-button :chat="chat" />
      </div>
    </div>
    <hr />
    <div class="px-2 chat-content-container" ref="chatContainer">
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
import hub from "../../hubs/chathub.js";
import { ref, nextTick } from "vue";

export default {
  components: {
    ChatContentInput,
    ChatContentMessage,
    ChatAddButton,
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
    user(oldValue, newValue) {
      console.log(newValue);
    },
  },
  methods: {
    receiveMessage(message) {
      this.chat.messages.push(message);
    },
    scrollToBottom() {
      console.log(this.$refs.chatContainer);
      if (this.$refs.chatContainer) {
        console.log(this.$refs.chatContainer.scrollHeight);
        this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
      }
    },
  },
  created() {
    this.emitter.on("openChat", async (newChat) => {
      if (this.chat) {
        hub.RemoveFromChat(this.chat.id, this.user.userId);
      }
      this.chat = newChat;

      console.log(newChat);
      await hub.AddToChat(this.chat.id);

      this.scrollToBottom();
    });
    hub.emitter.on("receiveMessage", (message) => {
      console.log(message);
      this.chat.messages.push(message);
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
