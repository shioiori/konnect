<template>
  <div>
    <el-button type="primary" plain @click="confirmSynchronizeCalendar"
      >Synchronize with Calendar</el-button
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    confirmSynchronizeCalendar() {
      ElMessageBox.confirm(
        "Các thao tác như thêm sự kiện sẽ được cập nhật vào Google Calendar của bạn thay vì lưu trữ ở cơ sở dữ liệu của hệ thống. Tiếp tục?",
        "Warning",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          try {
            gapi.client.load("calendar", "V3", this.addEventsToGoogleCalendar.bind(this));
            this.synchronizeWithGoogleCalendar();
            ElMessage({
              message: "Đồng bộ hoá thành công",
              type: "success",
            });
          } catch (e) {
            ElMessage({
              message: e.message,
              type: "error",
            });
          }
        })
        .catch((e) => {});
    },

    synchronizeWithGoogleCalendar() {
      axios
        .post(import.meta.env.VITE_API + "/timetable/synchronize", getHeaderConfig())
        .catch((e) => {
          console.error(e.message);
        });
    },

    addEventsToGoogleCalendar() {
      this.$emit("addEventsToGoogleCalendar");
    },
  },
};
</script>
