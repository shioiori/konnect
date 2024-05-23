<template>
  <div class="d-flex">
    <el-checkbox-group
      v-model="eventCategories"
      @change="$emit('filterEvent', eventCategories)"
    >
      <el-checkbox label="Thời khoá biểu" value="Timetable" checked />
      <el-checkbox label="Google" value="Google" />
      <el-checkbox label="Người dùng" value="User" />
      <el-checkbox label="Chưa phân loại" value="Unclassified" />
    </el-checkbox-group>
    <div class="text-end" style="flex-grow: 1">
      <el-text tag="b">Trạng thái đồng bộ hoá&nbsp;</el-text>
      <el-switch
        v-if="timetable"
        v-model="timetable.isSynchronize"
        class="ml-2"
        inline-prompt
        active-text="Bật"
        inactive-text="Tắt"
        @click="synchronizeTimetable"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  data() {
    return {
      eventCategories: ["Timetable", "Google", "User", "Unclassified"],
    };
  },
  props: {
    timetable: Object,
  },
  watch: {
    timetable(newValue, oldValue) {},
  },
  methods: {
    synchronizeTimetable() {
      if (this.timetable.isSynchronize) {
        //bật
        this.confirmSynchronizeCalendar();
      } else {
        //tắt
        this.synchronizeWithGoogleCalendar(false);
      }
    },
    confirmSynchronizeCalendar() {
      ElMessageBox.confirm(
        "Thời khoá biểu sẽ được cập nhật vào Google Calendar của bạn. Tiếp tục?",
        "Warning",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      ).then(() => {
        try {
          this.$emit("getEventsInDatabase");
          this.emitter.emit("handleAuthorize");
          this.synchronizeWithGoogleCalendar(true);
          ElMessage({
            message: "Bật đồng bộ hoá thành công",
            type: "success",
          });
        } catch (e) {
          console.error(e.message);
          this.timetable.isSynchronize = false;
          ElMessage({
            message: "Có lỗi xảy ra trong quá trình bật đồng bộ hoá",
            type: "error",
          });
        }
      });
    },

    synchronizeWithGoogleCalendar(state) {
      axios
        .post(import.meta.env.VITE_API + "/timetable/synchronize", {}, getHeaderConfig())
        .then(() => {
          if (!state) {
            ElMessage({
              message: "Tắt đồng bộ hoá thành công",
              type: "success",
            });
          }
        })
        .catch((e) => {
          console.log(e.message);
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
