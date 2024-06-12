<template>
  <div class="pe-2 py-3 chat-input d-flex" style="border-top: 1px solid var(--Gray)">
    <el-input
      v-model="message"
      placeholder="Please input"
      @keydown.enter="sendMessage"
      maxlength="500"
    />
    <div class="mx-2">
      <i class="bi bi-image h3" @click="$refs.avatar.click()"></i>
      <input type="file" @change="handleFileUpload" ref="avatar" hidden />
    </div>
    <div>
      <i class="bi bi-send h3"></i>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import hub from "../../hubs/chathub.js";
import { ElMessage, ElLoading } from "element-plus";
import { uploadImageToImgur } from "../../utils/ImageHandler.js";
import { linkify } from "../../utils/StringHandler.js";
export default {
  data() {
    return {
      message: "",
      service: {
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
    };
  },
  props: {
    chat: Object,
    user: Object,
  },
  watch: {
    user(oldValue, newValue) {},
  },
  methods: {
    sendImage() {},
    sendMessage() {
      if (this.message.trim() == "") return;
      hub.SendMessage(this.chat.id, {
        text: linkify(this.message),
        isImage: false,
        chatId: this.chat.id,
        createdBy: this.user.id,
      });
      this.message = "";
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) {
        ElMessage({
          type: "error",
          message: "File không tồn tại",
        });
        return;
      }

      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSizeInBytes = 5 * 1024 * 1024; // 2 MB

      if (!validImageTypes.includes(file.type)) {
        ElMessage({
          type: "error",
          message: "Chỉ có thể tải file ảnh lên",
        });
        return;
      }

      if (file.size > maxSizeInBytes) {
        ElMessage({
          type: "error",
          message: `Ảnh không thể vượt quá 2 MB. Kích cỡ file của bạn hiện tại là ${(
            file.size /
            1024 /
            1024
          ).toFixed(2)} MB.`,
        });
        return;
      }
      const formData = new FormData();
      formData.append("image", file);
      this.uploadFile(formData);
    },
    async uploadFile(file) {
      const loading = ElLoading.service(this.service);
      try {
        const url = await uploadImageToImgur(file);
        hub.SendMessage(this.chat.id, {
          text: `<img src=${url} class='msg-content--image'>`,
          isImage: true,
          chatId: this.chat.id,
          createdBy: this.user.id,
        });
      } catch (err) {
        ElMessage({
          type: "error",
          message: "Có lỗi trong quá trình xử lý ảnh",
        });
      }
      loading.close();
    },
  },
};
</script>

<style>
.chat-input {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.msg-content--link {
  text-decoration: none;
  color: rgba(var(--bs-link-color-rgb), var(--bs-link-opacity, 1));
}
</style>
