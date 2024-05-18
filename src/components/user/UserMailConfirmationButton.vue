<template>
  <div v-if="!isConfirm">
    <el-button type="primary" plain @click="confirmMail">Confirm mail</el-button>
  </div>
</template>
<script>
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";

export default {
  props: {
    isConfirm: Boolean,
  },
  methods: {
    confirmMail() {
      axios
        .post(import.meta.env.VITE_API + "/confirm-mail", {}, getHeaderConfig())
        .then((res) => {
          this.$forceUpdate();
        });
    },
  },
};
</script>
