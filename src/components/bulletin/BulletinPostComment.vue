<template>
  <div class="comment">
    <div class="d-flex">
      <div class="post-comment-avatar">
        <img
          class="img-responsive rounded-circle"
          :src="comment.user.avatar"
          style="width: 40px; margin-right: 0.5rem"
        />
      </div>
      <div style="width: 100%">
        <div class="post-comment">
          <div>
            <h6 class="my-0">{{ comment.user.displayName }}</h6>
          </div>
          <div v-html="comment.content"></div>
        </div>
        <div class="post-time">
          <small class="text-muted">{{ comment.createdDate }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRelativeTime } from "../../utils/DateConverter.js";

export default {
  props: {
    comment: Object,
  },
  mounted() {
    this.comment.createdDate = getRelativeTime(this.comment.createdDate);
    if (!this.comment.user.avatar) {
      this.comment.user.avatar = "../../src/assets/images/avatar_default.png";
    }
  },
};
</script>

<style>
.post-comment {
  border-radius: 4px;
  border: 1px solid var(--Gray);
  width: 100%;
  padding: 0.5rem;
}

.comment {
  margin: 0.5rem 0;
}

.cmt-mention {
  text-decoration: none;
  color: var(--el-color-primary);
  font-weight: 600;
}
</style>
