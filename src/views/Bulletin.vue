<template>
  <div class="container">
    <div class="content">
      <div v-if="!this.$route.params.id">
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
import { ElMessage } from "element-plus";

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
  watch: {
    "$route.params.id": "checkRoute",
  },
  created() {
    this.getBulletinNews();
  },
  methods: {
    checkRoute() {
      if (!this.$route.params.id) {
        this.getBulletinNews();
      } else {
        this.getPost(this.$route.params.id);
      }
    },
    getBulletinNews() {
      console.log(2);
      axios
        .get(import.meta.env.VITE_API + "/bulletin?state=1", getHeaderConfig())
        .then((res) => {
          this.posts = res.data.posts;
        })
        .catch((e) => {
          ElMessage({
            type: "error",
            message: e.message,
          });
        });
    },
    getPost(id) {
      axios
        .get(import.meta.env.VITE_API + "/bulletin/" + id, getHeaderConfig())
        .then((res) => {
          this.posts = [];
          this.posts.push(res.data.post);
        })
        .catch((e) => {
          ElMessage({
            type: "error",
            message: e.message,
          });
        });
    },
  },
};
</script>

<style></style>
