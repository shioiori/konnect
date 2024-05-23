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
          <div class="d-flex">
            <i class="bi bi-people h4"></i>
            <span class="m-1">{{ post.comments.length }} bình luận</span>
          </div>
        </div>
        <div class="lastest-comment my-2" v-if="post.comments.length > 0">
          <bulletin-post-comment :comment="post.comments[0]" />
        </div>
        <bulletin-post-reply @add-comment="addComment" />
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :width="images.length > 0 ? 1280 : 720"
      align-center
    >
      <div class="row dialog">
        <div class="col-9" v-if="images.length > 0">
          <div class="block text-center" m="t-4">
            <el-carousel height="720px">
              <el-carousel-item v-for="item in images" :key="item">
                <div>
                  <img :src="item" style="height: inherit" />
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
        <div :class="'col-' + (images.length > 0 ? 3 : 12)">
          <div class="d-flex">
            <div class="post-avatar">
              <img class="img-responsive rounded-circle" :src="post.user.avatar" />
            </div>
            <div class="post-creator">
              <div>
                <h5 class="my-0">{{ post.user.displayName }}</h5>
              </div>
              <div>{{ post.createdDate }}</div>
            </div>
          </div>
          <div class="post-content my-3 dialog" ref="htmlContent">
            <div v-html="content" />
          </div>
          <hr />
          <div>
            <div>
              <div class="d-flex">
                <icon-user />
                <span class="m-1">{{ post.comments.length }} bình luận</span>
              </div>
            </div>
            <div class="list-comment my-3">
              <bulletin-post-comment
                v-for="(item, index) in post.comments"
                v-bind:comment="item"
                v-bind:key="index"
                v-bind:user="user"
              />
            </div>
            <bulletin-post-reply :user="post.user" @add-comment="addComment" />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BulletinPostComment from "./BulletinPostComment.vue";
import IconUser from "../icons/bulletin/IconUser.vue";
import BulletinPostReply from "./BulletinPostReply.vue";
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";
import { dateTimeToFormatDate } from "../../utils/DateConverter.js";
export default {
  components: {
    BulletinPostComment,
    BulletinPostReply,
    IconUser,
  },
  data() {
    return {
      dialogVisible: false,
      images: [],
      content: [],
    };
  },
  props: {
    post: Object,
  },
  mounted() {
    console.log(this.post);
    this.post.createdDate = dateTimeToFormatDate(this.post.createdDate);
    if (!this.post.user.avatar) {
      this.post.user.avatar = "../../src/assets/images/avatar_default.png";
    }
  },
  methods: {
    openDialog() {
      this.images = [];
      const htmlImages = this.$refs.htmlContent.getElementsByTagName("img");
      this.content = "";
      this.dialogVisible = true;
      if (htmlImages.length > 0) {
        for (var i = 0; i < htmlImages.length; i++) {
          this.images.push(htmlImages[i].src);
        }
      } else {
      }
      this.content = this.$refs.htmlContent.outerHTML;
    },

    addComment(comment) {
      axios
        .post(
          import.meta.env.VITE_API + "/bulletin/" + this.post.id + "/comment",
          {
            content: comment,
          },
          getHeaderConfig()
        )
        .then((res) => {
          console.log(res.data);
          console.log(this.post.comments[0]);
          this.post.comments.push(res.data.comment);
        });
    },
  },
};
</script>

<style>
.post {
  border: 1px solid var(--Gray);
  border-radius: 0.5rem;
  margin: 2rem 0;
}

.post-avatar {
  margin: auto 0;
}

.post-creator {
  margin: auto 0.5rem;
}

.post-avatar img {
  width: 48px;
}

.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

img {
  max-height: 360px;
  width: auto;
}

.dialog img {
  max-height: none;
}

.post-content.dialog img {
  display: none;
}
</style>
