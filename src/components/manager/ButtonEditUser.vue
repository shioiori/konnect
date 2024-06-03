<template>
  <div>
    <el-button link type="warning" @click="bindUserToDialog">
      <el-icon>
        <Edit />
      </el-icon>
    </el-button>
    <el-dialog v-model="dialogVisible" title="User" width="720">
      <div class="py-4">
        <el-form :model="editingUser" label-position="right" label-width="auto">
          <el-form-item label="Username" prop="userName" v-if="action == 'add'" required>
            <el-input v-model="editingUser.userName" />
          </el-form-item>
          <el-form-item label="Name" prop="displayName" required>
            <el-input v-model="editingUser.displayName" />
          </el-form-item>
          <el-form-item label="Email" prop="email" required>
            <el-input v-model="editingUser.email" />
          </el-form-item>
          <el-form-item label="Phone" prop="phoneNumber">
            <el-input v-model="editingUser.phoneNumber" />
          </el-form-item>
          <div class="text-end pb-3" v-if="action == 'add'">
            <i class="text-muted"
              ><span class="text-danger">* </span>Lưu ý: Mật khẩu sẽ được đặt giống với
              username</i
            >
          </div>
          <div class="d-flex justify-content-end">
            <el-form-item>
              <el-button type="primary" @click="saveUser()"> Save </el-button>
              <el-button type="info" @click="dialogVisible = false">Cancel</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      editingUser: undefined,
      action: "edit",
    };
  },
  props: {
    user: Object,
    index: Number,
  },
  watch: {
    action(oldValue, newValue) {
      console.log(this.action);
      if (newValue == "add") {
        this.clearUser();
        this.dialogVisible = true;
      } else {
        this.bindUserToDialog();
        this.dialogVisible = true;
      }
    },
  },
  mounted() {
    this.editingUser = { ...this.user };
    this.changeAction();
  },
  methods: {
    changeAction() {
      this.emitter.on("changeAction", (action) => {
        this.action = action;
        console.log(action);
      });
    },
    bindUserToDialog() {
      this.dialogVisible = true;
      this.action = "edit";
      this.editingUser = {
        displayName: this.user.displayName,
        email: this.user.email,
        phoneNumber: this.user.phoneNumber,
        avatar: this.user.avatar,
      };
    },
    editUser() {
      axios
        .post(
          import.meta.env.VITE_API + "/user/" + this.user.userName,
          this.editingUser,
          getHeaderConfig()
        )
        .then((res) => {
          ElMessage({
            message: res.data.message,
            type: res.data.type,
          });
          this.user.displayName = this.editingUser.displayName;
          this.user.email = this.editingUser.email;
          this.user.phoneNumber = this.editingUser.phoneNumber;
          this.dialogVisible = false;
        })
        .catch((e) => {
          ElMessage({
            message: e.message,
            type: "error",
          });
        });
    },

    addUser() {
      axios
        .post(import.meta.env.VITE_API + "/user", this.editingUser, getHeaderConfig())
        .then((res) => {
          ElMessage({
            message: res.data.message,
            type: res.data.type,
          });
          this.$emit("addUser", res.data.user);
          this.dialogVisible = false;
        })
        .catch((e) => {
          ElMessage({
            message: e.message,
            type: "error",
          });
        });
    },
    saveUser() {
      if (this.action == "add") {
        this.addUser();
      } else {
        this.editUser();
      }
    },
    clearUser() {},
  },
};
</script>
<style lang=""></style>
