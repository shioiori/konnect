<template>
  <div>
    <el-button type="primary" plain @click="dialogVisible = true"
      >Import thời gian biểu</el-button
    >
    <el-dialog v-model="dialogVisible" title="Import timetable" width="720">
      <div class="text-center py-4">
        <IconImport @click="$refs.file.click()" />
        <h5>Chọn file tải lên</h5>
        <el-text>
          Hệ thống chỉ nhận file thời khoá biểu download từ qldt.utc.edu.vn
          <!-- hoặc sử dụng
          <el-link
            type="primary"
            href="../../../assets/template/Import timetable template.xlsx"
            download
            >template</el-link
          > -->
        </el-text>
        <div>
          <input
            type="file"
            ref="file"
            @change="handleFileChange($event)"
            accept="image/*"
            capture
            hidden
          />
          <div class="mt-4">
            <el-button type="primary" @click="$refs.file.click()"
              ><icon-button-import />&nbsp; Import</el-button
            >
            <el-button type="info" plain @click="dialogVisible = false">Close</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import IconImport from "../icons/import/IconImport.vue";
import IconButtonImport from "../icons/import/IconButtonImport.vue";

import { ElMessage, ElLoading } from "element-plus";
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";
import { getLoadingService } from "../../utils/LoadingService.js";

export default {
  components: {
    IconImport,
    IconButtonImport,
  },
  data() {
    return {
      dialogVisible: false,
      fileUpload: undefined,
    };
  },
  props: {
    timetable: Object,
  },
  watch: {
    timetable(oldValue, newValue) {},
  },
  methods: {
    importTimetable() {
      var formData = new FormData();
      formData.append("image", this.fileUpload);
      const loading = ElLoading.service(getLoadingService());
      axios
        .post(
          import.meta.env.VITE_API + "/import/timetable",
          {
            file: this.fileUpload,
          },
          getHeaderConfig("multipart/form-data")
        )
        .then((res) => {
          if (this.timetable.isSynchronize) {
            if (res.data.success) {
              this.$emit("listEvents", res.data.events);
            } else {
              ElMessage({
                message: ex.message,
                type: "error",
              });
            }
          }
          ElMessage({
            message: res.data.message,
            type: res.data.type,
          });
          this.dialogVisible = false;
          this.$emit("refreshCalendar");
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
        this.importTimetable();
      }
      this.dialogImportVisible = false;
    },
  },
};
</script>
