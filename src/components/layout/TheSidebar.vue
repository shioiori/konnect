<template>
  <div :class="['l-navbar', this.isOpen ? 'show' : '']" id="nav-bar">
    <div class="d-flex flex-column flex-shrink-0 px-1 py-2 bg-body-tertiary" style="height: 100vh">
      <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
        <img src="../../assets/logo.png" style="width: 100%;">
        <span class="fs-4">&nbsp;</span>
      </a>
      <hr>
      <ul class="nav nav-pills flex-column mb-auto">
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
      </div>
    </div>
  </div>
</template>

<script>
import IconBulletin from '../icons/IconBulletin.vue';
import IconChat from '../icons/IconChat.vue';
import IconStorage from '../icons/IconStorage.vue';
import IconTimetable from '../icons/IconTimetable.vue';
import { RouterLink, RouterView } from 'vue-router'

export default {
  components: {
    IconBulletin,
    IconChat,
    IconStorage,
    IconTimetable
  },
  data() {
    return {
      isOpen: false
    }
  },
  mounted() {
    // this.emitter.on('toggle-sidebar', () => {
    //   this.isOpen = !this.isOpen
    // })
  },
  methods: {
    toggleSidebar() {
      this.isOpen = !this.isOpen
    }
  }
}
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
</style>