<template>
  <div class="container">
    <div class="content">
      <div>
        <bulletin-add-post @refresh-bulletin="getBulletinNews" />
      </div>
      <div>
        <bulletin-post
          v-for="(item, index) in posts"
          v-bind:post="item"
          v-bind:key="index"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BulletinAddPost from "../components/bulletin/BulletinAddPost.vue";
import BulletinPost from "../components/bulletin/BulletinPost.vue";

import axios from "axios";
import router from "../router/index.ts";
import { getHeaderConfig } from "../utils/ApiHandler.js";

export default {
  components: {
    BulletinAddPost,
    BulletinPost,
  },
  data() {
    return {
      posts: [],
    };
  },
  mounted() {
    this.getBulletinNews();
  },
  methods: {
    async getBulletinNews() {
      var res = (
        await axios.get(import.meta.env.VITE_API + "/bulletin/1", getHeaderConfig())
      ).data;
      if (res.success) {
        this.posts = res.posts;
      }
    },
    onSidebarCollapse() {
      this.isSidebarCollapse = !this.isSidebarCollapse;
    },
  },
};
</script>

<style></style>
