<template>
  <div>
    <vue-advanced-chat
      :current-user-id="currentUserId"
      :rooms="JSON.stringify(rooms)"
      :rooms-loaded="true"
      :messages="JSON.stringify(messages)"
      :messages-loaded="messagesLoaded"
      @send-message="sendMessage($event.detail[0])"
      @fetch-messages="fetchMessages($event.detail[0])"
    />
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
      currentUserId: undefined,
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
    };
  },
  mounted() {
    axios
      .get(import.meta.env.VITE_API + "/user", getHeaderConfig())
      .then((res) => {
        this.currentUserId = res.data.id;
      })
      .catch((err) => {
        ElMessage({
          message: "Không tìm thấy thông tin đăng nhập của người dùng",
          type: "error",
        });
        router.push("/login");
      });

    axios
      .get(import.meta.env.VITE_API + "/chat/search", getHeaderConfig())
      .then((res) => {
        this.rooms = res.data;
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
          return res.messages;
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
      axios.post(import.meta.env.VITE_API + "/chat", {}, getHeaderConfig()).catch((e) => {
        ElMessage({
          type: "error",
          message: e.message,
        });
      });
    },
  },
};
</script>
