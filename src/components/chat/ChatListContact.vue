<template>
  <div style="height: inherit">
    <chat-list-contact-search @search-chat="getSearchChat" />

    <div style="overflow: auto; height: 35rem; padding-right: 0.5rem">
      <el-list style="height: inherit">
        <chat-list-contact-item
          v-for="(chat, index) in chats"
          @click="openChat(chat)"
          :chat="chat"
        />
      </el-list>
    </div>
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
    this.registerlistenChangeChatName();
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
          this.chats.forEach((chat) => {
            if (chat.messages.length > 0) {
              var lastMessage = chat.messages[chat.messages.length - 1];
              if (/^true$/i.test(lastMessage.isImage)) {
                chat.lastMessage = chat.createdBy.displayName + ": [Ảnh]";
              } else {
                chat.lastMessage =
                  chat.createdBy.displayName + ": " + removeHTMLTags(lastMessage.text);
              }
            }
          });
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
      // data is {chatId: $id, message: $message }
      this.emitter.on("updateLastMessage", (data) => {
        var updateChat = this.chats.find((x) => x.id == data.chatId);
        console.log(data.message);
        if (/^true$/i.test(data.message.isImage)) {
          updateChat.lastMessage = updateChat.createdBy.displayName + ": [Ảnh]";
        } else {
          updateChat.lastMessage =
            updateChat.createdBy.displayName + ": " + removeHTMLTags(data.message.text);
        }
      });
    },
    registerlistenChangeChatName() {
      this.emitter.on("changeChatName", (chat) => {
        var updateChat = this.chats.find((x) => x.id == chat.id);
        updateChat.name = chat.name;
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
