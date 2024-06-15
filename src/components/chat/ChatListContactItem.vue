<template>
  <el-list-item>
    <div class="d-flex">
      <div class="chat-avatar-img me-2">
        <img
          class="img-responsive rounded-circle"
          :src="chat.avatar"
          style="width: 40px; height: 40px"
        />
      </div>
      <div class="chat-info mt-2">
        <b>{{ chat.name }}</b>
        <div>
          <span class="text-muted" v-if="chat.messages.length > 0">
            <small v-if="chat.lastMessage">{{ chat.lastMessage }}</small>
          </span>
        </div>
      </div>
    </div>

    <hr />
  </el-list-item>
</template>

<script>
import { removeHTMLTags } from "../../utils/StringHandler.js";
export default {
  props: {
    chat: Object,
  },
  watch: {
    chat(oldValue, newValue) {},
  },
  mounted() {
    if (
      this.chat != undefined &&
      this.chat.messages.length > 0 &&
      this.chat.lastMessage == undefined
    ) {
      var lastMessage = this.chat.messages[this.chat.messages.length - 1];
      if (lastMessage.isImage) {
        this.chat.lastMessage = this.chat.createdBy.displayName + ": [Ảnh]";
      } else {
        this.chat.lastMessage =
          this.chat.createdBy.displayName + ": " + removeHTMLTags(lastMessage.text);
      }
    }
  },
};
</script>

<style></style>
