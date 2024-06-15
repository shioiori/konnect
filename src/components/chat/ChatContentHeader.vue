<template>
  <div class="d-flex col-md-9" v-if="chat">
    <h4 v-if="!editState" class="chat-header">
      {{ chat.name }}
    </h4>
    <el-input
      v-if="editState"
      v-model="name"
      @keyup.enter="updateChatName"
      maxlength="50"
    />
    <h4 class="ms-2" style="display: flex; align-items: center">
      <el-icon>
        <EditPen @click="updateEditState" />
      </el-icon>
    </h4>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    chat: Object,
  },
  data() {
    return {
      editState: false,
      name: "",
    };
  },
  mounted() {
    this.name = this.chat.name;
  },
  watch: {
    chat(oldValue, newValue) {},
  },
  methods: {
    updateEditState() {
      this.editState = !this.editState;
    },
    updateChatName() {
      this.editState = false;
      axios
        .post(
          import.meta.env.VITE_CHAT_API +
            "/chat/change-name?id=" +
            this.chat.id +
            "&name=" +
            this.name,
          {}
        )
        .then((res) => {
          this.chat.name = this.name;
          this.emitter.emit("changeChatName", this.chat);
        });
    },
  },
};
</script>

<style>
.chat-header {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
