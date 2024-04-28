<template>
  <div class="container-fluid">
    <div class="row">
      <div :class="['col-' + (this.isSidebarCollapse ? '1' : '2')]" style="padding: 0;">
        <the-sidebar @toggle-sidebar="onSidebarCollapse" />
      </div>
      <div :class="['col-' + (this.isSidebarCollapse ? '11' : '10')]" style="padding: 0;">
        <div>
          <the-navbar @toggle-sidebar="onSidebarCollapse" />
        </div>
        <div class="container">
          <div class="content">
            <div>
              <bulletin-add-post @refresh-bulletin="getBulletinNews" />
            </div>
            <div>
              <bulletin-post v-for="(item, index) in news" v-bind:news="item" v-bind:key="index" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BulletinAddPost from '../components/bulletin/BulletinAddPost.vue'
import BulletinPost from '../components/bulletin/BulletinPost.vue'
import TheNavbar from '../components/layout/TheNavbar.vue'
import TheSidebar from '../components/layout/TheSidebar.vue'

import axios from 'axios'
import router from '../router/index.ts'
import { getHeaderConfig } from '../utils/ApiHandler.js'

export default {
  components: {
    BulletinAddPost,
    BulletinPost,
    TheNavbar,
    TheSidebar
  },
  data() {
    return {
      news: [],
      isSidebarCollapse: true,
    }
  },
  mounted() {
    this.getBulletinNews();
  },
  methods: {
    async getBulletinNews() {
      var res = (
        await axios.get(
          import.meta.env.VITE_API + '/bulletin/1', getHeaderConfig()
        )
      ).data
      if (res.success) {
        this.news = res.news;
      }
    },
    onSidebarCollapse() {
      this.isSidebarCollapse = !this.isSidebarCollapse;
    }
  }
}
</script>

<style>
.content {
  padding: 2rem 1rem;
}
</style>
