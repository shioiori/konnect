<template>
  <div v-if="message">
    <div class="d-flex">
      <el-card class="p-0" shadow="never">
        {{ message.text }}
      </el-card>
    </div>
    <small class="text-muted">{{ message.createdDate }}</small>
  </div>
</template>

<script>
import { dateTimeToFormatDate, getRelativeChatTime } from "../../utils/DateConverter.js";

export default {
  props: {
    message: Object,
  },
  mounted() {
    let dateFormat = dateTimeToFormatDate(this.message.createdDate);
    this.message.createdDate = getRelativeChatTime(dateFormat);
  },
  methods: {},
};
</script>

<style></style>
