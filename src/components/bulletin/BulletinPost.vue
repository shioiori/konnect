<template>
    <div class="my-3">
        <el-card shadow="hover">
            <div class="d-flex">
                <div class="post-avatar">
                    <img class="img-responsive rounded-circle" src="https://i.imgur.com/hczKIze.jpg">
                </div>
                <div class="post-creator">
                    <div>
                        <h5 class="my-0">{{ posts.createdBy }}</h5>
                    </div>
                    <div>{{ posts.createdDate }}</div>
                </div>
            </div>
            <div class="post-content my-3">
                <div v-html="posts.content" />
            </div>
            <hr />
            <div>
                <div>
                    <div class="f-flex">
                        <icon-user />
                        <span class="m-1">{{ posts.replyCount }} bình luận</span>
                    </div>
                </div>
                <div class="list-comment">

                </div>
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
    </div>
</template>

<script>
import BulletinPostComment from './BulletinPostComment.vue';
import IconUser from '../icons/bulletin/IconUser.vue'
import IconSend from '../icons/bulletin/IconSend.vue'

export default {
    components: {
        BulletinPostComment,
        IconUser,
        IconSend,
    },
    props: {
        posts: Object,
    },
    mounted() {
    },
}
</script>

<style>
.post {
    border: 1px solid var(--Gray);
    border-radius: .5rem;
    margin: 2rem 0;
}

.post-avatar {
    margin: auto 0;
}

.post-creator {
    margin: auto .5rem;
}

.post-avatar img {
    width: 48px;
}
</style>