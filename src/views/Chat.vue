<template>
  <div>
    <div>
      <el-row>
        <el-col :span="3">
          <el-menu
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            v-for="(item, index) in users"
          >
            <el-menu-item
              index="index"
              @click="getChat(item.userName)"
              v-if="item.userName != currentUser"
            >
              <template #title>
                <el-icon>
                  <el-avatar :size="36" :src="item.avatar" />
                </el-icon>
                <span>{{ item.userName }}</span>
              </template>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="21">
          <vue-advanced-chat
            :current-user-id="currentUser"
            :rooms="JSON.stringify(rooms)"
            :rooms-loaded="true"
            :messages="JSON.stringify(messages)"
            :messages-loaded="messagesLoaded"
            @send-message="sendMessage($event.detail[0])"
            @fetch-messages="fetchMessages($event.detail[0])"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { register } from "vue-advanced-chat";
import axios from "axios";
import { getHeaderConfig } from "../utils/ApiHandler.js";
import router from "../router/index.ts";
import { ElMessage } from "element-plus";

register();

export default {
  data() {
    return {
      currentUser: undefined,
      rooms: [
        {
          roomId: "1",
          roomName: "Room 1",
          avatar: "https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj",
          users: [
            { _id: "1234", username: "John Doe" },
            { _id: "4321", username: "John Snow" },
          ],
        },
      ],
      messages: [],
      messagesLoaded: false,
      users: [],
      isCollapsed: false,
    };
  },
  props: {
    user: Object,
  },
  mounted() {
    console.log(getHeaderConfig());
    this.currentUser = this.user.userName;
    axios
      .get(import.meta.env.VITE_API + "/user/group", getHeaderConfig())
      .then((res) => {
        this.users = res.data;
      })
      .catch((err) => {
        ElMessage({
          message: err.message,
          type: "error",
        });
      });

    axios
      .get(import.meta.env.VITE_API + "/chat/search", getHeaderConfig())
      .then((res) => {
        this.rooms = res.data;
        console.log(this.rooms);
      })
      .catch((err) => {
        ElMessage({
          message: err.message,
          type: "error",
        });
      });
  },
  methods: {
    fetchMessages({ options = {} }) {
      setTimeout(() => {
        if (options.reset) {
          this.messages = this.getMessages(true);
        } else {
          this.messages = [...this.getMessages(), ...this.messages];
          this.messagesLoaded = true;
        }
      });
    },

    getMessages(reset) {
      axios
        .get(import.meta.env.VITE_API + "/chat", getHeaderConfig())
        .then((res) => {
          return res.data.messages;
        })
        .catch((e) => {
          ElMessage({
            type: "error",
            message: e.message,
          });
        });
    },

    sendMessage(message) {
      this.messages = [
        ...this.messages,
        {
          _id: this.messages.length,
          content: message.content,
          senderId: this.currentUserId,
          timestamp: new Date().toString().substring(16, 21),
          date: new Date().toDateString(),
        },
      ];
      axios
        .post(import.meta.env.VITE_API + "/message", {}, getHeaderConfig())
        .catch((e) => {
          ElMessage({
            type: "error",
            message: e.message,
          });
        });
    },
    getChat(username) {
      let param = `users=${this.currentUser}&users=${username}`;
      axios
        .get(import.meta.env.VITE_API + "/chat?" + param, {}, getHeaderConfig())
        .then((response) => {
          console.log(response);
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
