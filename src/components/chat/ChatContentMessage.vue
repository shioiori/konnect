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
import { dateTimeToFormatDate } from "../../utils/DateConverter.js";

export default {
  props: {
    message: Object,
  },
  mounted() {
    console.log(this.message);
    this.message.createdDate = dateTimeToFormatDate(this.createdDate);
  },
  methods: {},
};
</script>

<style></style>
