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
  mounted() {
    this.getBulletinNews();
  },
  methods: {
    getBulletinNews() {
      axios
        .get(import.meta.env.VITE_API + "/bulletin/1", getHeaderConfig())
        .then((res) => {
          console.log(res.data);
          this.posts = res.data.posts;
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
