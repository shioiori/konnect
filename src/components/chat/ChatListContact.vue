<template>
  <div style="height: inherit">
    <el-list style="height: inherit">
      <el-list-item>
        <chat-list-contact-search @search-chat="getSearchChat" />
      </el-list-item>
      <chat-list-contact-item
        v-for="(chat, index) in chats"
        @click="openChat(chat)"
        :chat="chat"
      />
    </el-list>
  </div>
</template>

<script>
import ChatListContactSearch from "./ChatListContactSearch.vue";
import ChatListContactItem from "./ChatListContactItem.vue";
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";
import { getLoadingService } from "../../utils/LoadingService.js";
import { removeHTMLTags } from "../../utils/StringHandler.js";
import { ElMessage, ElLoading } from "element-plus";
export default {
  components: {
    ChatListContactSearch,
    ChatListContactItem,
  },
  data() {
    return {
      chats: [],
      currentData: undefined,
    };
  },
  created() {
    this.registerlistenLastMessage();
  },
  mounted() {
    this.getUser();
    this.emitter.on("insertChat", () => {
      this.getSearchChat();
    });
  },
  methods: {
    openChat(chat) {
      this.emitter.emit("openChat", chat);
    },
    getSearchChat(searchName) {
      const loading = ElLoading.service(getLoadingService());
      if (searchName == undefined) searchName = "";
      axios
        .get(
          import.meta.env.VITE_CHAT_API +
            `/chat?groupId=${this.currentData.groupId}&userId=${this.currentData.id}&name=${searchName}`
        )
        .then((res) => {
          this.chats = res.data;
          loading.close();
        });
    },
    getUser() {
      axios.get(import.meta.env.VITE_API + "/user", getHeaderConfig()).then((res) => {
        this.currentData = res.data;
        this.getSearchChat();
      });
    },
    registerlistenLastMessage() {
      this.emitter.on("updateLastMessage", (data) => {
        console.log(data);
        var updateChat = this.chats.find((x) => x.id == data.chatId);
        updateChat.lastMessage =
          this.currentData.displayName + ": " + removeHTMLTags(data.message.text);
      });
    },
  },
};
</script>

<style>
.chat-info {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-avatar-img {
  display: flex;
  vertical-align: middle;
  align-items: center;
}
</style>
