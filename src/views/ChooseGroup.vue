<template>
  <div class="container my-4">
    <h1>Nhóm của bạn</h1>
    <div>
      <div class="my-2">
        <group-add-button @get-group="getGroupByUser" />
      </div>
      <el-row :gutter="20">
        <group-item
          v-for="item in groups"
          :group="item"
          @click="loginWithGroup(item.id)"
        />
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getHeaderConfig } from "../utils/ApiHandler.js";
import router from "../router/index.ts";
import { ElMessage } from "element-plus";
import GroupButtonJoinByCode from "../components/selectGroup/GroupButtonJoinByCode.vue";
import GroupItem from "../components/selectGroup/GroupItem.vue";
import GroupAddButton from "../components/selectGroup/GroupAddButton.vue";
export default {
  components: {
    GroupButtonJoinByCode,
    GroupItem,
    GroupAddButton,
  },
  data() {
    return {
      groups: [],
    };
  },
  mounted() {
    this.getGroupByUser();
  },
  methods: {
    async loginWithGroup(id) {
      axios
        .post(
          import.meta.env.VITE_API + "/login/" + id,
          {
            groupId: id,
          },
          getHeaderConfig()
        )
        .then((res) => {
          ElMessage({
            message: "Chào mừng quay trở lại",
            type: "success",
          });
          localStorage.setItem(import.meta.env.VITE_TOKEN_NAME, res.data.accessToken);
          router.push("/");
        })
        .catch((err) => {
          localStorage.setItem(import.meta.env.VITE_TOKEN_NAME, "");
          router.push("/login");
        });
    },
    async getGroupByUser() {
      axios
        .get(import.meta.env.VITE_API + "/group/all", getHeaderConfig())
        .then((res) => {
          this.groups = res.data.groups;
        })
        .catch((e) => {
          router.push("/login");
        });
    },
  },
};
</script>
