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
import { ElMessage } from 'element-plus'

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
      axios.post(import.meta.env.VITE_API + '/login/' + this.groupId, {
        groupId: this.groupId
      }, getHeaderConfig()).then((res) => {
        ElMessage({
          message: "Chào mừng quay trở lại",
          type: 'success',
        });
        localStorage.setItem(import.meta.env.VITE_TOKEN_NAME, res.data.accessToken);
        router.push('/');
      }).catch((err) => {
        localStorage.setItem(import.meta.env.VITE_TOKEN_NAME, '');
        router.push('/login');
      });
    },
    async getGroupByUser() {
      axios.get(import.meta.env.VITE_API + '/group', getHeaderConfig()).then((res) => {
        this.groups = res.data.groups;
      }).catch(e => {
        router.push('/login');
      });
    }
  },
}
</script>