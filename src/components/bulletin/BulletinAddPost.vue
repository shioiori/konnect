<template>
    <div class="blt-add">
        <div>
            <ckeditor :editor="editor" v-model="editorData" :config="editorConfig">
            </ckeditor>
        </div>
        <div>
            <div class="">
                <!-- <div @click="chooseSpecificUser">
                    <button type="button" class="btn-pink btn-sub">
                        <icon-add-user /> Send to only
                    </button>
                </div> -->
                <div class="d-flex justify-content-end pt-2">
                    <button type="button" class="btn btn-blue" @click="uploadNews">
                        <icon-button-send /> Post
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import IconAddImage from '../icons/bulletin/IconAddImage.vue'
import IconAddUser from '../icons/bulletin/IconAddUser.vue'
import IconButtonSend from '../icons/bulletin/IconButtonSend.vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios'
import { getHeaderConfig } from '../../utils/ApiHandler.js'

export default {
    components: {
        IconAddImage,
        IconAddUser,
        IconButtonSend,
        ClassicEditor
    },
    methods: {
        async uploadNews() {
            var res = (await axios.post(import.meta.env.VITE_API + '/bulletin', {
                Content: this.editorData
            }, getHeaderConfig())).data;
            console.log(res)
            this.$emit('refreshBulletin');
        },
        addImage() {
        },
        chooseSpecificUser() { }
    },
    data() {
        return {
            receivers: [],
            content: '',
            images: [],
            editor: ClassicEditor,
            editorData: '',
            editorConfig: {
                placeholder: 'Have something new? Send it to all~'
            }
        }
    },
}
</script>

<style>
.blt-add button svg {
    height: 1.175rem;
    vertical-align: -.2rem;
}

.blt-add button svg path {
    stroke: var(--White)
}

.blt-add button {
    padding: .375rem 1.5rem;
}

.btn-sub {
    border-radius: 5rem !important;
    border: none;
    padding: .25rem 1rem !important;
    margin-top: .25rem;
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