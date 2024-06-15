<template>
  <div>
    <el-button type="danger" plain @click="deleteTimetable">Xoá thời gian biểu</el-button>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";

export default {
  props: {
    timetable: Object,
  },
  watch: {
    timetable(oldValue, newValue) {},
  },
  methods: {
    deleteTimetable() {
      ElMessageBox.confirm(
        "Tất cả sự kiện trong thời gian biểu của bạn sẽ bị vĩnh viễn. Tiếp tục?",
        "Warning",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      ).then(() => {
        if (this.timetable.isSynchronize) {
          this.$emit("removeAllEventsSynchronized");
          return;
        }
        axios
          .delete(import.meta.env.VITE_API + "/timetable", getHeaderConfig())
          .then((res) => {
            ElMessage({
              type: res.data.type,
              message: res.data.message,
            });
            this.$emit("refreshCalendar");
          })
          .catch((e) => {
            ElMessage({
              type: "error",
              message: e.message,
            });
          });
      });
    },
  },
};
</script>
