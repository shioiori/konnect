<template>
  <div>
    <el-button type="danger" plain @click="deleteTimetable">Xoá thời gian biểu</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    deleteTimetable() {
      ElMessageBox.confirm(
        "Thời khoá biểu của bạn sẽ bị xoá vĩnh viễn. Tiếp tục?",
        "Warning",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      ).then(() => {
        axios
          .delete(import.meta.env.VITE_API + "/timetable", getHeaderConfig())
          .then(() => {
            ElMessage({
              type: "success",
              message: "Delete completed",
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
