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
    async uploadFile() {
      if (this.fileUpload) {
        const formData = new FormData();
        formData.append("image", this.fileUpload);
        console.log(env);
        console.log(`Client-ID ${import.meta.env.VITE_IMGUR_CLIENT_ID}`);
        await axios
          .post("https://api.imgur.com/3/image", formData, {
            headers: {
              Authorization: `Client-ID ${import.meta.env.VITE_IMGUR_CLIENT_ID}`,
            },
          })
          .then((response) => {
            this.avatar = response.data.data.link;
            ElMessage({
              type: "success",
              message: "Lưu ảnh đại diện thành công",
            });
          })
          .catch((error) => {
            ElMessage({
              type: "error",
              message: e.message,
            });
            this.avatar = "";
          });
      }
    },
    handleFileChange(event) {
      this.useDefaultAvatar = false;
      this.fileUpload = event.target.files[0];
      var reader = new FileReader();
      reader.onload = function (event) {
        this.avatar = event.target.result;
      };
      reader.readAsDataURL(this.fileUpload);
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
