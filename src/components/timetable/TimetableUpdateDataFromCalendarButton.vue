<template>
  <div>
    <el-button type="primary" plain @click="getDataFromGoogleCalendar"
      >Update data from Calendar</el-button
    >
  </div>
</template>

<script>
import { ElMessage } from "element-plus";

export default {
  data() {
    return {
      askForRequest: false,
    };
  },
  props: {
    events: Array,
  },
  methods: {
    getDataFromGoogleCalendar(error) {
      this.$emit("listEvents");
    },
  },
};
</script>
