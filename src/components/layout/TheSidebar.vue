<template>
  <div class="sidebar-container">
    <el-container style="height: 100vh">
      <el-menu default-active="1" class="el-menu-vertical-demo" :collapse="isCollapse">
        <el-menu-item class="menu-item" index="0">
          <img style="width: 100%" src="../../assets/logo.png" />
        </el-menu-item>
        <el-menu-item class="menu-item" index="1">
          <i class="bi bi-newspaper"></i>
          <template #title><router-link to="/">Bulletin</router-link></template>
        </el-menu-item>
        <el-menu-item class="menu-item" index="2">
          <i class="bi bi-calendar3"></i>
          <template #title><router-link to="/timetable">Timetable</router-link></template>
        </el-menu-item>
        <el-menu-item class="menu-item" index="3">
          <i class="bi bi-chat-text"></i>
          <template #title><router-link to="/chat">Chat</router-link></template>
        </el-menu-item>
        <el-menu-item class="menu-item" index="4">
          <i class="bi bi-list-task"></i>
          <template #title><router-link to="/todo">To do list</router-link></template>
        </el-menu-item>
        <el-menu-item class="menu-item" index="4">
          <i class="bi bi-robot"></i>
          <template #title><router-link to="/ai">AI assistant</router-link></template>
        </el-menu-item>
        <el-menu-item
          class="menu-item"
          index="5"
          v-if="user != undefined && user.roleName != 'User'"
        >
          <i class="bi bi-gear"></i>
          <template #title
            ><router-link to="/group-manager">Manager</router-link></template
          >
        </el-menu-item>
        <!-- <el-menu-item class="menu-item">
        <el-icon @click="this.isCollapse = !this.isCollapse">
          <Expand />
        </el-icon>
      </el-menu-item> -->
      </el-menu>
      <!-- <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
          <router-link to="/" class="nav-link link-body-emphasis">
            <icon-bulletin />
            <span class="link-text">Bulletin</span>
          </router-link>
        </li>
        <li>
          <router-link to="/timetable" class="nav-link link-body-emphasis">
            <icon-timetable />
            <span class="link-text">Timetable</span>
          </router-link>
        </li>
        <li>
          <router-link to="/storage" class="nav-link link-body-emphasis">
            <icon-storage />
            <span class="link-text">Storage</span>
          </router-link>
        </li>
        <li>
          <router-link to="/chat" class="nav-link link-body-emphasis">
            <icon-chat />
            <span class="link-text">Chat</span>
          </router-link>
        </li>
      </ul>
      <hr>
      <div class="header_toggle px-3 fs-4" @click="$emit('toggleSidebar')">
        <i class="bi bi-list" color="black"></i>
      </div> -->
    </el-container>
  </div>
</template>

<script>
import IconBulletin from "../icons/IconBulletin.vue";
import IconChat from "../icons/IconChat.vue";
import IconStorage from "../icons/IconStorage.vue";
import IconTimetable from "../icons/IconTimetable.vue";
import { RouterLink, RouterView } from "vue-router";
import router from "../../router/index.ts";

export default {
  components: {
    IconBulletin,
    IconChat,
    IconStorage,
    IconTimetable,
  },
  data() {
    return {
      isCollapse: false,
    };
  },
  props: {
    user: Object,
  },
  mounted() {
    // this.emitter.on('toggle-sidebar', () => {
    //   this.isOpen = !this.isOpen
    // })
    console.log(this.user);
  },
  methods: {
    toggleSidebar() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style scoped>
.l-navbar {
  overflow: hidden;
}

.col-1 .link-text {
  display: none;
}

.link-text {
  margin-left: 1rem;
  vertical-align: middle;
  font-size: large;
}

.col-1 .header_toggle,
.col-1 .nav-link {
  text-align: center;
}
.sidebar-container .menu-item {
  padding-left: 2rem;
}
.menu-item a {
  text-decoration: none;
}

.sidebar-container i {
  transform: scale(1.5);
  margin-right: 1rem;
}
</style>
