<template>
  <div class="reply">
    <div>
      <div class="d-flex">
        <img
          :src="avatar"
          class="img-responsive rounded-circle"
          style="width: 40px; height: 40px; margin-right: 0.5rem"
        />
        <div class="form-group me-2 mt-1" style="width: 100%">
          <VueTribute :options="options">
            <input
              v-model="comment"
              style="margin-right: 0.5rem"
              placeholder="Please input"
              @keydown.enter="addComment"
              class="form-control"
            />
          </VueTribute>
        </div>
        <i class="bi bi-send h2" @click="addComment"></i>
      </div>
      <div class="container" ref="menuContainer" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";
import VueTribute from "vue-tribute";
import { ref, onMounted } from "vue";
import "tributejs/dist/tribute.css";

export default {
  components: {
    VueTribute,
  },
  data() {
    return {
      comment: "",
      avatar: "",
      users: [],
      options: {
        trigger: "@",
        values: [
          { key: "Collin Henderson", value: "syropian" },
          { key: "Sarah Drasner", value: "sarah_edo" },
          { key: "Evan You", value: "youyuxi" },
          { key: "Adam Wathan", value: "adamwathan" },
        ],
        positionMenu: false,
        menuContainer: document.body,
      },
    };
  },
  props: {
    user: Object,
  },
  mounted() {
    this.avatar =
      this.user != undefined
        ? this.user.avatar
        : "../../../src/assets/images/avatar_default.png";
    this.getUsers();
    this.options.values = this.users;
    this.options.menuContainer = this.$refs.menuContainer;
  },
  methods: {
    addComment() {
      if (this.checkString(this.comment)) return;
      this.$emit("addComment", this.comment);
      this.comment = "";
    },
    checkString(str) {
      const regex = /^@(\S+|\S+\s\S+\s?\S*)$/;
      return regex.test(str);
    },
    async getUsers() {
      const url = `${import.meta.env.VITE_API}/user/group`;
      try {
        const res = await axios.get(url, getHeaderConfig());
        res.data.users.forEach((element) => {
          this.users.push({
            key: element.displayName,
            value: element.userName,
          });
        });
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
  },
};
</script>

<style>
.menu-container {
  color: #fff;
  position: relative;
  margin: 100px auto 0;
  padding: 20px;
  width: 400px;
}

.tribute-container {
  position: relative;
}

.tribute-container ul {
  margin: 0;
  margin-top: 2px;
  padding: 0;
  list-style: none;
  background: #fff;
  border-radius: 4px;
  border: 1px solid rgba(#000, 0.13);
  background-clip: padding-box;
  overflow: hidden;
}

.tribute-container li {
  color: var(--el-color-primary);
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
}

.tribute-container li.highlight,
.tribute-container li:hover {
  background: var(--el-color-primary);
  color: #fff;
}

.tribute-container li span {
  font-weight: bold;
}

.tribute-container li.no-match {
  cursor: default;
}

.tribute-container .menu-highlighted {
  font-weight: bold;
}
</style>
