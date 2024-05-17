<template>
    <div>
        <el-button type="primary" plain @click="confirmSynchronizeCalendar"
          >Synchronize with Calendar</el-button
        >
    </div>
</template>

<script>
import GoogleGapiHandler from "../../utils/GoogleGapiHandler.js";

export default {
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    confirmSynchronizeCalendar() {
      ElMessageBox.confirm(
        "Thời khoá biểu sẽ được cập nhật vào Google Calendar của bạn. Tiếp tục?",
        "Warning",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          gapi.client.load("calendar", "V3", this.addEventsToGoogleCalendar.bind(this));
          this.synchronizeWithGoogleCalendar();
          ElMessage({
            message: "Đồng bộ hoá thành công",
            type: "success",
          });
        })
        .catch((e) => {
          ElMessage({
            message: e.message,
            type: "error",
          });
        });
    },

    synchronizeWithGoogleCalendar() {
      axios
        .post(import.meta.env.VITE_API + "/timetable/synchronize", getHeaderConfig())
        .catch((e) => {
          console.error(e.message);
        });
    },

    addEventsToGoogleCalendar(){
        this.$emit('addEventsToGoogleCalendar');
    }
  }
}
</script>