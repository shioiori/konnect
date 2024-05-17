<template>
    <div>
        <el-button type="primary" plain @click="dialogVisible = true"
          >Import timetable</el-button
        >
        <el-dialog v-model="dialogVisible" title="Import timetable" width="720">
            <div class="text-center py-4">
                <IconImport @click="$refs.file.click()" />
                <h5>Select a file to import</h5>
                <p>
                    Using file export from qldt.utc.edu.vn or download template import
                    <el-link
                    type="primary"
                    href="../../assets/template/Import timetable template.xlsx"
                    download
                    >here</el-link
                    >
                </p>
                <div>
                    <input
                    type="file"
                    ref="file"
                    @change="handleFileChange($event)"
                    accept="image/*"
                    capture
                    hidden
                    />
                    <el-button type="primary" @click="$refs.file.click()">Import</el-button>
                    <el-button type="info" plain @click="dialogVisible = false"
                    >Close</el-button
                    >
                </div>
            </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogVisible: false,
            fileUpload: undefined,
        }
    },
    methods: {
        importTimetable() {
            var formData = new FormData();
            formData.append("image", this.fileUpload);
            axios
                .post
                (
                    import.meta.env.VITE_API + "/import/timetable",
                    {
                        file: this.fileUpload,
                    },
                    getHeaderConfig("multipart/form-data")
                )
                .then((res) => {
                    ElMessage({
                        message: "Import success.",
                        type: "success",
                    });
                    this.$emit("refreshCalendar");
                })
                .catch((e) => {
                    ElMessage({
                        message: e.message,
                        type: "error",
                    });
            });
        },

        handleFileChange(event) {
            this.fileUpload = event.target.files[0];
            if (this.fileUpload) {
                this.importTimetable();
            }
            this.dialogImportVisible = false;
        },
    }
}
</script>