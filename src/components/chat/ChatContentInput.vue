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
import axios from "axios";
import hub from "../../hubs/chathub.js";

export default {
  data() {
    return {
      message: "",
    };
  },
  props: {
    chat: Object,
  },
  watch: {},
  methods: {
    sendImage() {},
    sendMessage() {
      if (this.message.trim() == "") return;
      hub.SendMessage(this.chat.id, {
        text: this.message,
        isImage: false,
        chatId: this.chat.id,
        createdBy: this.chat.createdBy.id,
      });
      this.message = "";
      hub.connection.on("ReceiveMessage", (obj) => {
        console.log(obj);
        this.$emit("receiveMessage", JSON.parse(obj));
        //hub.connection.off("ReceiveMessage");
      });
    },
  },
};
</script>

<style>
.chat-input {
  position: absolute;
  bottom: 0;
}
</style>
