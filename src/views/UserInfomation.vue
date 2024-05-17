<template>
     <el-descriptions
    class="margin-top"
    title="With border"
    :column="1"
    :size="size"
  >
    <!-- <template #extra>
      <el-button type="primary">Operation</el-button>
    </template> -->
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <user />
          </el-icon>
          UserName
        </div>
      </template>
      kooriookami
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <office-building />
          </el-icon>
          Password
        </div>
      </template>
      ************ 
      <user-change-password-button/>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <tickets />
          </el-icon>
          Display name
        </div>
      </template>
      Test
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <iphone />
          </el-icon>
          Telephone
        </div>
      </template>
      18100000000
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <location />
          </el-icon>
          Email
        </div>
      </template>
      test@test <user-mail-confirmation-button :isConfirm="user.emailConfimation"/>
    </el-descriptions-item>
  </el-descriptions>

</template>

<script>
import UserChangePasswordButton from '@/components/user/UserChangePasswordButton.vue';
import UserMailConfirmationButton from '@/components/user/UserMailConfirmationButton.vue'

export default {
    components: {
        UserChangePasswordButton,
        UserMailConfirmationButton
    },
    data(){
        return{
            user: {}
        }
    },
    mounted() {
        this.getCurrentUser();
    },
    methods: {
        getCurrentUser(){
            axios.get(import.meta.env.VITE_API + "/user", getHeaderConfig()).then((res) => {
                this.user = res.data.user;
            });
        }
    }
}
</script>

<style></style>