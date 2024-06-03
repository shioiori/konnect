<template>
  <div class="p-2" v-if="chat" style="position: relative; height: 100%">
    <div class="mt-2 d-flex">
      <h4>{{ chat.name }}</h4>
      <div style="margin-left: auto">
        <chat-add-button :chat="chat" />
      </div>
    </div>
    <hr />
    <div class="px-2">
      <chat-content-message
        :user="user"
        v-for="(message, index) in chat.messages"
        v-bind:message="message"
      />
    </div>
    <chat-content-input :chat="chat" @receive-message="receiveMessage" />
  </div>
</template>

<script>
import ChatContentInput from "./ChatContentInput.vue";
import ChatContentMessage from "./ChatContentMessage.vue";
import ChatAddButton from "./ChatAddButton.vue";
import hub from "../../hubs/chathub.js";

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
  },
  mounted() {
    this.emitter.on("openChat", (newChat) => {
      if (this.chat) {
        hub.RemoveFromChat(this.chat.id, this.user.userId);
      }
      this.chat = newChat;

      console.log(newChat);
      hub.AddToChat(this.chat.id);
    });
    hub.emitter.on("ReceiveMessage", (message) => {
      console.log(message);
      this.chat.messages.push(message);
    });
  },
};
</script>

<style></style>
