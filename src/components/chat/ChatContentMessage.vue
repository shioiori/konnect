<template>
  <div v-if="message && user" class="mb-1">
    <div
      :class="
        'd-flex ' +
        (user.userName != message.createdBy.userName ? '' : 'justify-content-end')
      "
    >
      <div class="chat-avatar" v-if="user.userName != message.createdBy.userName">
        <img
          class="img-responsive rounded-circle"
          :src="
            message.createdBy.avatar
              ? message.createdBy.avatar
              : '../../src/assets/images/avatar_default.png'
          "
          style="width: 56px; height: 56px"
        />
      </div>
      <div :class="user.userName != message.createdBy.userName ? '' : 'text-end'">
        <div>
          <span class="text-muted" v-if="user.userName != message.createdBy.userName">{{
            message.createdBy.displayName
          }}</span>
        </div>
        <div class="chat-message-content" shadow="never">
          <div v-html="message.text" />
        </div>
        <small class="text-muted">{{ formatDate }}</small>
      </div>
    </div>
  </div>
</template>

<script>
import { dateTimeToFormatDate, getRelativeChatTime } from "../../utils/DateConverter.js";

export default {
  props: {
    message: Object,
    user: Object,
  },
  watch: {
    user(oldValue, newValue) {
      console.log(this.user);
    },
  },
  methods: {},
  computed: {
    formatDate() {
      let dateFormat = dateTimeToFormatDate(this.message.createdDate);
      return getRelativeChatTime(dateFormat);
    },
  },
};
</script>

<style>
.chat-message-content {
  border: 1px solid var(--Gray);
  border-radius: 0.25rem;
  padding: 0.5rem 0.75rem;
}
</style>
