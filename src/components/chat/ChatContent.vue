<template>
  <div class="p-2">
    <div>
      <chat-content-message
        v-for="(message, index) in messages"
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
      messages: [],
    };
  },
  props: {
    currentUser: Object,
  },
  methods: {},
};
</script>

<style></style>
