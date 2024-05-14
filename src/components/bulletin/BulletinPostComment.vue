<template>
  <div class="comment">
    <div class="d-flex">
      <div class="post-comment-avatar">
        <img
          class="img-responsive rounded-circle"
          src="https://i.imgur.com/hczKIze.jpg"
          style="width: 40px; margin-right: 0.5rem"
        />
      </div>
      <div style="width: 100%">
        <div class="post-comment">
          <div>
            <b class="my-0">{{ comment.displayName }}</b>
          </div>
          <div>{{ comment.content }}</div>
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
    console.log(this.comment.createdDate);
    this.comment.createdDate = getRelativeTime(this.comment.createdDate);
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
</style>
