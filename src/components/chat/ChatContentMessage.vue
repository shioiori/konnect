<template>
  <div>
    <el-card style="width: 480px" shadow="never">{{ message.content }}</el-card>
    <small class="text-muted">{{ message.createdDate }}</small>
  </div>
</template>

<script>
import { dateTimeToFormatDate } from "../../utils/DateConverter.js";

export default {
  props: {
    message: Object,
  },
  mounted() {
    this.message.createdDate = dateTimeToFormatDate(this.post.createdDate);
  },
};
</script>

<style></style>
