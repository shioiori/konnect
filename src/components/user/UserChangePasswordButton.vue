<template>
    <div>
      <el-button type="primary" plain @click="dialogVisible = true">Change password</el-button>
      <el-dialog v-model="dialogRemindVisible" title="Remind me" width="720">
        <div>
            <el-form
            label-position="right"
            label-width="auto"
            :model="formLabelAlign"
            style="max-width: 600px"
        >
            <el-form-item label="Mật khẩu cũ">
            <el-input v-model="passwordConfirmation.oldPassword" type="password" show-password/>
            </el-form-item>
            <el-form-item label="Mật khẩu mới">
            <el-input v-model="passwordConfirmation.newPassword" type="password" show-password/>
            </el-form-item>
            <el-form-item label="Xác nhận mật khẩu">
            <el-input v-model="passwordConfirmation.newPasswordConfirm" type="password" show-password/>
            </el-form-item>
            <div class="text-end">
                <el-button type="primary" plain @click="changePassword()">Change</el-button>
                <el-button type="info" plain @click="dialogVisible = false"
              >Close</el-button
            >
            </div>
        </el-form>
        </div>
      </el-dialog>
    </div>
</template>

<script lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
const ruleFormRef = ref<FormInstance>()

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password'))
  } else {
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass')
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password again'))
  } else if (value !== ruleForm.pass) {
    callback(new Error("Two inputs don't match!"))
  } else {
    callback()
  }
}
const rules = reactive<FormRules<typeof ruleForm>>({
  pass: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }],
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
    }
  })
}
export default {
    data(){
        return {
            passwordConfirmation: reactive({
                oldPassword: '',
                newPassword: '',
                newPasswordConfirm: '',
            }),
            dialogVisible: false,
        }
    },
    methods: {
        changePassword(){

        },
        submitForm = (formEl: FormInstance | undefined) => {
            if (!formEl) return
            formEl.validate((valid) => {
                if (valid) {
                    this.changePassword();
                }
            })
        }
    }
}
</script>

<style></style>