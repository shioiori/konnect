<template>
  <div class="px-2 chat-search">
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
      this.search = "";
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
