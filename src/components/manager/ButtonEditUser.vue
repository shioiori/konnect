<template>
    <div>
        <el-button link type="warning" @click="bindUserToDialog">
            <el-icon>
                <Edit />
            </el-icon>
        </el-button>
        <el-dialog v-model="dialogVisible" title="User" width="720">
            <div class="py-4">
                <el-form :model="event" label-position="right" label-width="auto">
                    <el-form-item prop="avatar" v-if="user.avatar">
                        <el-image :src="user.avatar">
                            <template #error>
                                <div class="image-slot">
                                    <el-icon><icon-picture /></el-icon>
                                </div>
                            </template>
                        </el-image>
                    </el-form-item>
                    <el-form-item label="Username" prop="userName" v-if="action == 'add'">
                        <el-input v-model="editingUser.userName" />
                    </el-form-item>
                    <el-form-item label="Name" prop="displayName">
                        <el-input v-model="editingUser.displayName" />
                    </el-form-item>
                    <el-form-item label="Email" prop="email">
                        <el-input v-model="editingUser.email" />
                    </el-form-item>
                    <el-form-item label="Phone" prop="phoneNumber">
                        <el-input v-model="editingUser.phoneNumber" />
                    </el-form-item>
                    <div class="text-end pb-3" v-if="action == 'add'">
                        <i class="text-muted"><span class="text-danger">* </span>Lưu ý: Mật khẩu sẽ được đặt giống với
                            username</i>
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
        }
    },
    props: {
        user: Object,
        index: Number,
        action: String,
    },
    watch: {
        action(oldValue, newValue) {
            if (newValue == 'add') {
                this.clearUser();
                this.dialogVisible = true;
            }
            else {
                this.bindUserToDialog();
                this.dialogVisible = true;
            }
        }
    },
    mounted(){
        this.editingUser = structuredClone(this.user);
    },
    methods: {
        bindUserToDialog() {
            this.dialogVisible = true;
            this.action = 'edit';
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
                    this.$emit('addUser', res.data.user);
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
        clearUser() {

        }
    }
}
</script>
<style lang="">

</style>