<template>
  <el-list-item>
    <div class="d-flex mt-0">
      <!-- <div class="chat-avatar-img me-2">
        <img
          class="img-responsive rounded-circle"
          :src="chat.avatar"
          style="width: 40px; height: 40px"
        />
      </div> -->
      <div class="chat-info">
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
};
</script>

<style></style>
