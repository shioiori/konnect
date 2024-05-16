<template>
  <div class="p-2 chat-input">
    <el-input
      v-model="message"
      placeholder="Please input"
      @keydown.enter="sendMessage"
      maxlength="500"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "",
    };
  },
  methods: {
    sendImage() {},
    sendMessage() {},
  },
};
</script>

<style>
.chat-input {
  position: absolute;
  bottom: 0;
}
</style>
