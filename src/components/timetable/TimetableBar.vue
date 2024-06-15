<template>
  <div class="d-flex">
    <el-checkbox-group
      v-model="eventCategories"
      @change="$emit('filterEvent', eventCategories)"
    >
      <el-checkbox label="Thời khoá biểu" value="Timetable" checked />
      <el-checkbox label="Google" value="Google" />
      <el-checkbox label="Người dùng" value="User" />
      <!-- <el-checkbox label="Chưa phân loại" value="Unclassified" /> -->
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
        @click="synchronizeWithGoogleCalendar"
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
    synchronizeWithGoogleCalendar() {
      axios
        .post(import.meta.env.VITE_API + "/timetable/synchronize", {}, getHeaderConfig())
        .then(() => {
          let state = this.timetable.isSynchronize ? "Bật" : "Tắt";
          ElMessage({
            message: state + " đồng bộ hoá thành công",
            type: "success",
          });
          this.emitter.emit("synchronizeTimetable", this.timetable.isSynchronize);
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
