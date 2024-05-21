<template>
  <div class="p-2" v-if="chat">
    <div>
      <h4>{{ chat.name }}</h4>
    </div>
    <el-divider />
    <div>
      <chat-content-message
        v-for="(message, index) in chat.messages"
        v-bind:message="message"
      />
    </div>
    <chat-content-input />
  </div>
</template>

<script>
import ChatContentInput from "./ChatContentInput.vue";
import ChatContentMessage from "./ChatContentMessage.vue";

export default {
  components: {
    ChatContentInput,
    ChatContentMessage,
  },
  data() {
    return {
      chat: {},
    };
  },
  props: {
    currentUser: Object,
  },
  methods: {},
  mounted() {
    this.emitter.on("openChat", (chat) => {
      this.chat = chat;
    });
  },
};
</script>

<style></style>
