<template>
  <div>
    <el-button type="primary" plain @click="dialogVisible = true"
      >Mời thành viên</el-button
    >
    <el-dialog v-model="dialogVisible" title="Mời thành viên" width="720">
      <div>
        <div class="my-2">Nhập tên đăng nhập <el-input v-model="username" /></div>
        <div class="my-2">
          Nếu người dùng chưa có tài khoản, gửi email tới người dùng
          <el-input v-model="email" />
        </div>
        <div class="d-flex justify-content-end mt-4">
          <el-button type="primary" @click="invitePeople">Send</el-button>
          <el-button type="info" plain @click="dialogVisible = false">Close</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      email: "",
      dialogVisible: false,
    };
  },
  method: {
    invitePeople() {
      let isExistUser = this.username == "" ? false : true;
      axios
        .post(
          import.meta.env.VITE_API + "/group/invite",
          {
            guest: isExistUser ? this.username : this.email,
            isExistUser: isExistUser,
          },
          getHeaderConfig()
        )
        .then((res) => {
          ElMessage({
            message: res.data.message,
            type: res.data.type,
          });
        })
        .catch((e) => {
          console.error(e.message);
          ElMessage({
            message: e.message,
            type: "error",
          });
        });
    },
  },
};
</script>

<style></style>
