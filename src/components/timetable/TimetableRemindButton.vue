<template>
    <div>
        <el-button type="primary" plain @click="dialogVisible = true"
          >Remind me</el-button
        >
        <el-dialog v-model="dialogRemindVisible" title="Remind me" width="720">
            <div class="py-4">
                <p class="text-center">
                    Please remind me before <el-input-number v-model="remindTime" />
                </p>
                <p class="text-end">
                    <i
                    ><small class="text-muted"
                        >Thông báo hẹn giờ sẽ chỉ có hiệu quả với những sự kiện được cập nhật sau
                        khi chỉnh sửa thời gian và được đồng bộ với Google Calendar. Những sự kiện
                        trước đó sẽ không có hiệu quả. Tương tự với việc tắt hẹn giờ. <br />Bật
                        hẹn giờ đồng nghĩa với việc bật đồng bộ. Tuy nhiên, tắt hẹn giờ sẽ không
                        tắt chế độ đồng bộ.
                    </small></i
                    >
                </p>
                <div class="d-flex justify-content-end">
                    <el-button type="primary" @click="updateRemindTime">Save</el-button>
                    <el-button type="danger" @click="turnOffRemindTime">Turn off</el-button>
                    <el-button type="info" plain @click="dialogVisible = false"
                    >Close</el-button
                    >
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      remindTime: 0
    }
  },
  props: {
    timetable: Object
  },
  methods: {
    updateRemindTime() {
        if (this.remindTime <= 0) {
            this.turnOffRemindTime();
            return;
        }
      axios
        .post(
          import.meta.env.VITE_API + "/timetable/remind/" + this.remindTime,
          {},
          getHeaderConfig()
        )
        .then(() => {
          ElMessage({
            type: "success",
            message: "Cập nhật thành công",
          });
          this.timetable.remindTime = this.remindTime;
        })
        .catch((e) => {
          ElMessage({
            type: "error",
            message: e.message,
          });
        });
      this.dialogRemindVisible = false;
    },

    turnOffRemindTime() {
      axios
        .post(import.meta.env.VITE_API + "/timetable/remind/-1", {}, getHeaderConfig())
        .then(() => {
          ElMessage({
            type: "success",
            message: "Cập nhật thành công",
          });
          this.remindTime = 0;
          this.timetable.remindTime = this.remindTime;
        })
        .catch((e) => {
          ElMessage({
            type: "error",
            message: e.message,
          });
        });
      this.dialogVisible = false;
    },
  },
}
</script>