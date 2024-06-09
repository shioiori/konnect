<template>
  <div class="reply">
    <div>
      <div class="d-flex" v-if="user">
        <img
          :src="user.avatar"
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
      user: {},
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
  mounted() {
    this.getUser();
    this.getUsers();
    this.options.values = this.users;
    this.options.menuContainer = this.$refs.menuContainer;
  },

  watch: {
    user(oldValue, newValue) {
      if (this.user && !this.user.avatar) {
        this.user.avatar = "../../src/assets/images/avatar_default.png";
      }
    },
  },
  methods: {
    addComment() {
      this.$emit("addComment", this.comment);
      this.comment = "";
    },
    getUser() {
      axios.get(import.meta.env.VITE_API + "/user", getHeaderConfig()).then((res) => {
        this.user = res.data;
      });
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
  height: auto;
  max-height: 300px;
  max-width: 11rem;
  left: calc(40px - 0.25rem);
  border: 1px solid var(--LightGray);
  border-radius: 5px;
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

::-webkit-scrollbar {
  width: 3px;
  /* Width of the scrollbar */
  height: 3px;
  /* Height of the scrollbar for horizontal scrolling */
}

::-webkit-scrollbar-thumb {
  background-color: var(--Gray);
  /* Color of the scrollbar thumb */
  border-radius: 10px;
  /* Rounded corners */
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  /* Color of the scrollbar track */
}
</style>
