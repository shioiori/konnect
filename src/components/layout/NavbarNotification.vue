<template>
  <el-dropdown>
    <div>
      <el-badge :is-dot="!isSeen" class="item">
        <el-icon>
          <Bell />
        </el-icon>
      </el-badge>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="(item, index) in notifications"
          @click="handlerNotificationClicked(index, item)"
        >
          <div style="width: 100%">
            <div class="d-flex" :class="item.isSeen ? '' : 'noti-unseen'">
              <div v-html="getIcon(item.action)" />
              <div v-html="item.content" />
            </div>
            <span class="text-muted">{{ getRelativeTime(item.createdDate) }}</span>
            <hr class="mt-2 mb-0" />
          </div>
        </el-dropdown-item>
        <el-dropdown-item>
          <div class="d-flex justify-content-between" style="flex-grow: 1">
            <el-link
              type="primary"
              @click="dialogVisible = true"
              v-if="notifications.length > 0"
              >Xem thêm</el-link
            >
            <el-link
              class="text-end"
              type="primary"
              @click="updateStateNotification"
              v-if="notifications.length > 0"
              >Đánh dấu tất cả đã đọc</el-link
            >
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";
import { getRelativeTime } from "../../utils/DateConverter.js";
import router from "../../router/index.ts";
import { ElMessage } from "element-plus";

export default {
  data() {
    return {
      notifications: [],
      isSeen: true,
      dialogVisible: false,
    };
  },
  created() {
    setInterval(() => this.getNotifications(true), 1000 * 30);
  },
  methods: {
    getNotifications(isPagination) {
      console.log("noti");
      axios
        .get(
          import.meta.env.VITE_API + "/notification?isPagination=" + isPagination,
          getHeaderConfig()
        )
        .then((res) => {
          if (res.data.notifications.length > 0) {
            this.isSeen = res.data.notifications[0].isSeen;
          }
          this.notifications = res.data.notifications;
        })
        .catch((e) => {
          console.error(e.message);
        });
    },
    updateStateNotification() {
      axios.post(import.meta.env.VITE_API + "/notification/seen", {}, getHeaderConfig());
      this.isSeen = true;
    },
    handlerNotificationClicked(index, noti) {
      this.updateOneNotification(index, noti.id);
      this.redirect(noti.action, noti.attach);
    },
    updateOneNotification(index, id) {
      axios.post(
        import.meta.env.VITE_API + "/notification/seen?id" + id,
        {},
        getHeaderConfig()
      );
      this.notifications[index].isSeen = true;
    },
    getIcon(type) {
      switch (type) {
        case "ReplyPost":
        case "ReplyComment":
          return '<i class="bi bi-reply-all"></i>';
        case "NewPost":
          return '<i class="bi bi-newspaper"></i>';
        case "PendingPost":
          return '<i class="bi bi-send-exclamation"></i>';
        case "AcceptPost":
          return '<i class="bi bi-send-check"></i>';
        case "RejectPost":
          return '<i class="bi bi-send-x"></i>';
        case "InviteToGroup":
          return '<i class="bi bi-person-plus"></i>';
        case "ChangeRole":
          return '<i class="bi bi-person-gear"></i>';
        case "Mention":
          return '<i class="bi bi-at"></i>';
        case "KickFromGroup":
          return '<i class="bi bi-person-slash"></i>';
        default:
          return;
      }
    },
    redirect(action, attach) {
      switch (action) {
        case "PendingPost":
          axios
            .get(import.meta.env.VITE_API + "/bulletin/" + attach.id, getHeaderConfig())
            .then((res) => {
              console.log(res.data);
              if (res.data.post.approved != -1) {
                ElMessage({
                  type: "warning",
                  message: "Bài đăng này đã được kiểm duyệt",
                });
              } else {
                router.push("/bulletin/pending/" + attach.id);
              }
            });
          return;
        case "NewPost":
        case "AcceptPost":
        case "RejectPost":
          router.push("/bulletin/" + attach.id);
          return;
        default:
          return;
      }
    },
    getAttachedInfo(object) {
      //console.log(object);
    },
    getRelativeTime(time) {
      return getRelativeTime(time);
    },
  },
};
</script>

<style>
.noti-unseen {
  font-weight: 600;
}

.comment-mention {
  text-decoration: none;
  color: var(--el-color-primary);
  font-weight: 600;
}
</style>
