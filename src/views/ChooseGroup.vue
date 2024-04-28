<template>
  <div>
    <h1>Your group</h1>
    <select v-model="groupId" class="form-select">
      <option v-for="item in groups" :value="item.id">{{ item.name }}</option>
    </select>
    <button class="btn btn-primary" @click="loginWithGroup">Go</button>
  </div>
</template>

<script>
import axios from 'axios'
import { getHeaderConfig } from '../utils/ApiHandler.js'
import router from '../router/index.ts';

export default {
  data() {
    return {
      groupId: '',
      groups: [],
    }
  },
  mounted() {
    this.getGroupByUser();
  },
  methods: {
    async loginWithGroup() {
      var res = (await axios.post(import.meta.env.VITE_API + '/login/' + this.groupId, {
        groupId: this.groupId
      }, getHeaderConfig())).data;
      console.log(res)
      if (res.success) {
        localStorage.setItem(import.meta.env.VITE_TOKEN_NAME, res.accessToken);
        router.push('/');
      }
      else {
        console.log(res)
      }
    },
    async getGroupByUser() {
      var res = await axios.get(import.meta.env.VITE_API + '/group', getHeaderConfig()).catch(e => {
        router.push('/login');
      });
      this.groups = res.data.groups;
    }
  },
}
</script>