<template>
    <div class="chat-container">
    <textarea v-model="userInput" placeholder="Type your message here..."></textarea>
    <button @click="sendMessage">Send</button>
    <div v-if="loading">Loading...</div>
    <div v-if="response">{{ response }}</div>
  </div>
</template>
<script>
import axios from "axios";
import { getChatGPTResponse } from "../utils/ApiHandler.js";

export default {
    data() {
    return {
      userInput: '',
      response: '',
      loading: false,
    };
  },
  methods: {
    async sendMessage() {
      this.loading = true;
      this.response = '';
      try {
        this.response = await getChatGPTResponse(this.userInput);
      } catch (error) {
        this.response = 'An error occurred. Please try again.';
      } finally {
        this.loading = false;
      }
    },
  },
}
</script>
<style>
    .chat-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>