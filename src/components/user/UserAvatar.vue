<template>
  <div>
    <div class="img-container">
      <el-avatar :src="avatar" :size="160" @click="$refs.avatar.click()"> </el-avatar>
    </div>
    <div class="" hidden>
      <input type="file" ref="avatar" @change="handleFileChange($event)" />
    </div>
  </div>
</template>

<script>
import { ElLoading, ElMessage } from "element-plus";
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";

export default {
  data() {
    return {
      fileUpload: undefined,
      avatar: "../src/assets/images/avatar_default.png",
    };
  },
  props: {
    user: Object,
  },
  mounted() {
    if (this.user.avatar) {
      this.avatar = this.user.avatar;
    }
  },
  methods: {
    uploadFile() {
      const loading = ElLoading.service({
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      if (this.fileUpload) {
        const formData = new FormData();
        formData.append("image", this.fileUpload);
        console.log(`Client-ID ${import.meta.env.VITE_IMGUR_CLIENT_ID}`);
        axios
          .post("https://api.imgur.com/3/image", formData, {
            headers: {
              Authorization: `Client-ID ${import.meta.env.VITE_IMGUR_CLIENT_ID}`,
            },
          })
          .then((response) => {
            this.avatar = response.data.data.link;
            this.updateAvatar();
          })
          .catch((error) => {
            ElMessage({
              type: "error",
              message: error.message,
            });
            this.avatar = "";
          })
          .finally(() => {
            loading.close();
          });
      } else {
        ElMessage({
          type: "error",
          message: "Không có file để upload",
        });
      }
    },
    updateAvatar() {
      axios
        .post(
          import.meta.env.VITE_API + "/user/avatar?url=" + this.avatar,
          {},
          getHeaderConfig()
        )
        .then((res) => {
          ElMessage({
            type: "success",
            message: "Lưu ảnh đại diện thành công",
          });
          this.$emit("updateAvatar", this.avatar);
          vm.$forceUpdate();
        })
        .catch((error) => {
          ElMessage({
            type: "error",
            message: error.message,
          });
          this.avatar = "";
        });
    },
    handleFileChange(event) {
      this.useDefaultAvatar = false;
      this.fileUpload = event.target.files[0];
      var reader = new FileReader();
      reader.onload = function (event) {
        this.avatar = event.target.result;
      };
      reader.readAsDataURL(this.fileUpload);
      this.uploadFile();
    },
  },
};
</script>

<style>
.img-container {
  display: flex;
  justify-content: center;
}
</style>
