<template>
  <div style="height: inherit">
    <el-list style="height: inherit">
      <el-list-item>
        <chat-list-contact-search @search-chat="getSearchChat" />
      </el-list-item>
      <el-list-item v-for="(chat, index) in chats" @click="openChat(chat)">
        <div class="d-flex">
          <div class="chat-avatar-img me-2">
            <img
              class="img-responsive rounded-circle"
              :src="chat.avatar"
              style="width: 40px; height: 40px"
            />
          </div>
          <div class="chat-info mt-2">
            <b>{{ chat.name }}</b>
            <div>
              <span class="text-muted" v-if="chat.messages.length > 0">
                <small>{{
                  chat.messages[0].createdBy.displayName + ": " + chat.messages[0].text
                }}</small>
              </span>
            </div>
          </div>
        </div>

        <hr />
      </el-list-item>
    </el-list>
  </div>
</template>

<script>
import ChatListContactSearch from "./ChatListContactSearch.vue";
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";

export default {
  components: {
    ChatListContactSearch,
  },
  data() {
    return {
      chats: [],
      currentData: undefined,
    };
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
      if (searchName == undefined) searchName = "";
      axios
        .get(
          import.meta.env.VITE_CHAT_API +
            `/chat?groupId=${this.currentData.groupId}&userId=${this.currentData.userId}&name=${searchName}`
        )
        .then((res) => {
          this.chats = res.data;
        });
    },
    getUser() {
      axios.get(import.meta.env.VITE_API + "/user", getHeaderConfig()).then((res) => {
        this.currentData = res.data;
        this.getSearchChat();
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
