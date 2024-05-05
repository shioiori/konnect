<template>
  <div class="my-3">
    <el-card shadow="hover" @click="openDialog">
      <div class="d-flex">
        <div class="post-avatar">
          <img
            class="img-responsive rounded-circle"
            src="https://i.imgur.com/hczKIze.jpg"
          />
        </div>
        <div class="post-creator">
          <div>
            <h5 class="my-0">{{ post.createdBy }}</h5>
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
          <div class="f-flex">
            <icon-user />
            <span class="m-1">{{ post.replyCount }} bình luận</span>
          </div>
        </div>
        <div class="list-comment"></div>
        <!-- <div class="reply">
                <div>
                    <div>
                        <image></image>
                    </div>
                    <input type="text" />
                    <icon-send />
                </div>
            </div> -->
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" width="1280" align-center>
      <div class="row dialog">
        <div class="col-md-9">
          <div class="block text-center" m="t-4">
            <el-carousel trigger="click" height="720px">
              <el-carousel-item v-for="item in images" :key="item">
                <el-image :src="item" fit="scale-down"></el-image>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
        <div class="col-md-3">
          <div class="d-flex">
            <div class="post-avatar">
              <img
                class="img-responsive rounded-circle"
                src="https://i.imgur.com/hczKIze.jpg"
              />
            </div>
            <div class="post-creator">
              <div>
                <h5 class="my-0">{{ post.createdBy }}</h5>
              </div>
              <div>{{ post.createdDate }}</div>
            </div>
          </div>
          <div class="post-content my-3" ref="htmlContent">
            <div v-html="content" />
          </div>
          <hr />
          <div>
            <div>
              <div class="f-flex">
                <icon-user />
                <span class="m-1">{{ post.replyCount }} bình luận</span>
              </div>
            </div>
            <div class="list-comment"></div>
            <div class="reply">
              <div>
                <div>
                  <image></image>
                </div>
                <input type="text" v-model="comment" />
                <icon-send @click="addComment" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BulletinPostComment from "./BulletinPostComment.vue";
import IconUser from "../icons/bulletin/IconUser.vue";
import IconSend from "../icons/bulletin/IconSend.vue";

import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";

export default {
  components: {
    BulletinPostComment,
    IconUser,
    IconSend,
  },
  data() {
    return {
      dialogVisible: false,
      images: [],
      content: [],
      comments: [],
      comment: "",
    };
  },
  props: {
    post: Object,
  },
  mounted() {
    this.comments = this.post.comments;
  },
  methods: {
    openDialog() {
      let htmlImages = this.$refs.htmlContent.getElementsByTagName("img");
      this.images = [];
      this.content = "";
      console.log(htmlImages.length);
      if (htmlImages.length > 0) {
        this.dialogVisible = true;
        for (var i = 0; i < htmlImages.length; i++) {
          this.images.push(htmlImages[i].src);
        }
      }
      //bug
      let clone = this.$refs.htmlContent.outerHTML.toString();
      this.content = clone.replace(/<img[^>]*>/g, "");
      console.log(this.content);
    },

    addComment() {
      axios
        .post(
          import.meta.env.VITE_API + "/bulletin/comment",
          {
            content: this.comment,
            id: this.post.id,
          },
          getHeaderConfig()
        )
        .then((res) => {
          this.comment = "";
          this.comment.push(res.data);
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
</style>
