<template>
  <div class="mt-3 mb-3 chat-search">
    <el-input
      v-model="search"
      placeholder="Find chat..."
      @keydown.enter="searchChat"
      maxlength="30"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
    };
  },
  methods: {
    searchChat() {
      this.$emit("searchChat", this.search);
    },
  },
};
</script>

<style>
.chat-search {
  vertical-align: middle;
  justify-content: center;
  display: flex;
}
</style>
