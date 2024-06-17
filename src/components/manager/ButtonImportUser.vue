<template>
  <div>
    <el-button type="primary" plain @click="dialogVisible = true"
      >Import danh sách thành viên</el-button
    >
    <el-dialog v-model="dialogVisible" title="Import danh sách người dùng" width="720">
      <div class="text-center py-4">
        <IconImport @click="$refs.file.click()" />
        <h5>Chọn file để tải lên</h5>
        <p>
          File được import cần tuân theo
          <el-link
            type="primary"
            href="/assets/templates/user_template.xlsx"
            download
            >mẫu</el-link
          >
        </p>
        <div>
          <input
            type="file"
            ref="file"
            @change="handleFileChange($event)"
            capture
            hidden
          />
          <el-button type="primary" @click="$refs.file.click()">Import</el-button>
          <el-button type="info" plain @click="dialogVisible = false">Close</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import IconImport from "../icons/import/IconImport.vue";
import IconButtonImport from "../icons/import/IconButtonImport.vue";
import axios from "axios";
import { ElMessage, ElLoading } from "element-plus";
import { getHeaderConfig } from "../../utils/ApiHandler.js";
import { getLoadingService } from "../../utils/LoadingService.js";

export default {
  components: {
    IconImport,
    IconButtonImport,
  },
  data() {
    return {
      fileUpload: undefined,
      dialogVisible: false,
    };
  },
  methods: {
    importUserToGroup() {
      var formData = new FormData();
      formData.append("image", this.fileUpload);
      const loading = ElLoading.service(getLoadingService());
      axios
        .post(
          import.meta.env.VITE_API + "/import/user",
          {
            file: this.fileUpload,
          },
          getHeaderConfig("multipart/form-data")
        )
        .then((res) => {
          this.users = res.data;
          ElMessage({
            message: res.data.message,
            type: res.data.type,
          });
          this.$emit("getUsers");
          this.dialogVisible = false;
        })
        .catch((e) => {
          ElMessage({
            message: e.message,
            type: "error",
          });
        })
        .finally(() => {
          loading.close();
        });
    },
    handleFileChange(event) {
      this.fileUpload = event.target.files[0];
      if (this.fileUpload) {
        this.importUserToGroup();
      }
    },
  },
};
</script>
<style></style>
