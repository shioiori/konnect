<template>
  <div class="reply">
    <div>
      <div class="d-flex">
        <img
          src="https://i.imgur.com/hczKIze.jpg"
          class="img-responsive rounded-circle"
          style="width: 40px; height: 40px; margin-right: 0.5rem"
        />
        <el-input
          v-model="comment"
          style="margin-right: 0.5rem"
          placeholder="Please input"
          @keydown.enter="addComment"
        />
        <i class="bi bi-send h2" @click="addComment"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      comment: "",
    };
  },
  methods: {
    addComment() {
      this.$emit("addComment", this.comment);
      this.comment = "";
    },
  },
};
</script>

<style></style>
