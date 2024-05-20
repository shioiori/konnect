<template>
    <div>
        <el-button type="primary" plain @click="dialogImportVisible = true">Import user</el-button>
        <el-dialog v-model="dialogImportVisible" title="Import users" width="720">
            <div class="text-center py-4">
                <IconImport @click="$refs.file.click()" />
                <h5>Select a file to import</h5>
                <p>
                    Download template import
                    <el-link type="primary" href="../../assets/template/Import user template.xlsx"
                        download>here</el-link>
                </p>
                <div>
                    <input type="file" ref="file" @change="handleFileChange($event)" accept="image/*" capture hidden />
                    <el-button type="primary" @click="$refs.file.click()">Import</el-button>
                    <el-button type="info" plain @click="dialogImportVisible = false">Close</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {

            fileUpload: undefined,
        }
    },
    methods: {
        importUserToGroup() {
            var formData = new FormData();
            formData.append("image", this.fileUpload);
            axios
                .post(
                    import.meta.env.VITE_API + "/import/user",
                    {
                        file: this.fileUpload,
                    },
                    getHeaderConfig("multipart/form-data")
                )
                .then((res) => {
                    this.users = res.data;
                    ElMessage({
                        message: res.data.message,
                        type: res.data.type,
                    });
                    this.$emit('getUsers');
                })
                .catch((e) => {
                    ElMessage({
                        message: e.message,
                        type: "error",
                    });
                });
        },
    }
}
</script>
<style></style>