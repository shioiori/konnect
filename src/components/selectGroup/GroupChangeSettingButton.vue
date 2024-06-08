<template>
  <div>
    <div class="text-end">
      <el-button type="primary" plain @click="dialogVisible = true"
        >Tham gia nhóm</el-button
      >
      <el-button type="primary" plain @click="dialogVisible = true">Tạo nhóm</el-button>
    </div>
    <el-dialog v-model="dialogVisible" title="Thêm nhóm mới" width="720">
      <div class="py-4">
        <el-form :model="group" label-position="left" label-width="auto">
          <el-form-item label="Tên nhóm" required>
            <el-input v-model="group.name" />
          </el-form-item>
          <el-form-item label="Mời thành viên">
            <el-checkbox
              v-model="group.allowInvite"
              label="Cho phép thành viên mời người vào trong nhóm"
            />
          </el-form-item>
          <el-form-item label="Rời nhóm">
            <el-checkbox
              v-model="group.allowOut"
              label="Cho phép thành viên tự ý rời nhóm"
            />
          </el-form-item>
          <div class="d-flex justify-content-end">
            <el-button type="primary" @click="addGroup">Save</el-button>
            <el-button type="info" plain @click="dialogVisible = false">Close</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
