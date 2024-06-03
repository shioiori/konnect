<template>
  <div class="blt-add">
    <div>
      <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"> </ckeditor>
    </div>
    <div>
      <div class="">
        <!-- <div @click="chooseSpecificUser">
                    <button type="button" class="btn-pink btn-sub">
                        <icon-add-user /> Send to only
                    </button>
                </div> -->
        <div class="d-flex justify-content-end pt-2">
          <el-button type="primary" @click="uploadNews">
            <icon-button-send /> Post
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconAddImage from "../icons/bulletin/IconAddImage.vue";
import IconAddUser from "../icons/bulletin/IconAddUser.vue";
import IconButtonSend from "../icons/bulletin/IconButtonSend.vue";
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";
import { ElMessage, ElMessageBox } from "element-plus";

import CKEditor from "@ckeditor/ckeditor5-vue";
import Editor from "ckeditor5-custom-build/build/ckeditor";

export default {
  components: {
    IconAddImage,
    IconAddUser,
    IconButtonSend,
    Editor,
  },
  methods: {
    async uploadNews() {
      axios
        .post(
          import.meta.env.VITE_API + "/bulletin",
          {
            Content: this.editorData,
          },
          getHeaderConfig()
        )
        .then((res) => {
          this.$emit("refreshBulletin");
          this.editorData = "";
          ElMessage({
            message: "Thêm file thành công",
            type: "success",
          });
        })
        .catch((e) => {
          ElMessage({
            message: e.message,
            type: "error",
          });
        });
    },
    addImage() {},
    chooseSpecificUser() {},
  },
  data() {
    return {
      receivers: [],
      content: "",
      images: [],
      editor: Editor,
      editorData: "",
      editorConfig: {
        placeholder: "Have something new? Send it to all~",
      },
    };
  },
};
</script>

<style>
.blt-add button svg {
  height: 1rem;
  vertical-align: -0.2rem;
}

.blt-add button svg path {
  stroke: var(--White);
}

.blt-add button {
  padding: 0.375rem 1.5rem;
}

.btn-sub {
  border-radius: 5rem !important;
  border: none;
  padding: 0.25rem 1rem !important;
  margin-top: 0.25rem;
}

.btn-pink {
  background: var(--Pink) !important;
  color: var(--White) !important;
}

.btn-red {
  background: var(--Red);
  color: var(--White);
}

.btn-blue {
  color: var(--White) !important;
  background: var(--SkyBlue) !important;
}

.btn-dismiss {
  color: var(--DarkGray);
  background: var(--White);
  border: 0.5px solid var(--LightGray);
}

.ck-editor__editable {
  min-height: 6rem;
}
</style>
