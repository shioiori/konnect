<template>
  <div class="my-3" v-if="post">
    <el-card shadow="hover" @click="openDialog">
      <div class="d-flex">
        <div class="post-avatar" v-if="post.user">
          <img class="img-responsive rounded-circle" :src="post.user.avatar" />
        </div>
        <div class="post-creator">
          <div>
            <h5 class="my-0">{{ post.user.displayName }}</h5>
          </div>
          <div>{{ post.createdDate }}</div>
        </div>
      </div>
      <div class="post-content my-3" ref="htmlContent">
        <div v-html="post.content" />
      </div>
      <hr />
      <div>
        <div>
          <h5>Duyệt tin</h5>
          <div>
            <span>Tin nhắn đính kèm <i class="text-muted">(tuỳ chọn)</i></span>
            <el-input v-model="message"></el-input>
          </div>
          <div class="text-end mt-2">
            <el-button type="success" @click="changePostState(1)">Đồng ý</el-button>
            <el-button type="danger" @click="changePostState(0)">Từ chối</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router/index.ts";
import { getHeaderConfig } from "../utils/ApiHandler.js";
import { ElMessage } from "element-plus";
import { dateTimeToFormatDate } from "../utils/DateConverter.js";

export default {
  data() {
    return {
      post: undefined,
      message: "",
    };
  },
  mounted() {
    this.getPost();
  },
  methods: {
    getPost() {
      if (!this.$route.params.id) {
        ElMessage({
          type: "error",
          message: "Bài đăng này hiện không tồn tại",
        });
        router.push("/");
      }
      axios
        .get(
          import.meta.env.VITE_API + "/bulletin/" + this.$route.params.id,
          getHeaderConfig()
        )
        .then((res) => {
          this.post = res.data.post;
          console.log(this.post);
          this.post.createdDate = dateTimeToFormatDate(this.post.createdDate);
          if (!this.post.user.avatar) {
            this.post.user.avatar = "../../src/assets/images/avatar_default.png";
          }
        })
        .catch((e) => {
          ElMessage({
            type: "error",
            message: e.message,
          });
        });
    },
    changePostState(state) {
      axios
        .post(
          import.meta.env.VITE_API + "/bulletin/" + this.$route.params.id + "/state",
          {
            postId: this.$route.params.id,
            state: state,
            message: this.message,
          },
          getHeaderConfig()
        )
        .then((res) => {
          ElMessage({
            type: res.data.type,
            message: res.data.message,
          });
          router.push("/");
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
