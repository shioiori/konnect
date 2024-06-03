<template>
  <div>
    <el-button type="primary" plain @click="getDataFromGoogleCalendar"
      >Kéo dữ liệu từ Google Calendar</el-button
    >
  </div>
</template>

<script>
import { ElMessage } from "element-plus";

export default {
  data() {
    return {};
  },
  props: {
    events: Array,
  },
  methods: {
    getDataFromGoogleCalendar() {
      this.$emit("listEvents");
    },
  },
};
</script>
