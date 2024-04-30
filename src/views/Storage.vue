<template>
    <div>
        <div>
            <div class="justify-content-end d-flex">
                <el-button type="primary" plain @click="dialogVisible = true">Upload file</el-button>
                <el-button type="primary" plain @click="synchronizeWithGoogleCalendar">New folder</el-button>
            </div>
        </div>
        <div>
            <el-table :data="files" stripe style="width: 100%">
                <el-table-column prop="date" label="Name"  />
                <el-table-column prop="name" label="Upload date" />
                <el-table-column prop="address" label="By" />
                <el-table-column prop="address" label="" />
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentFolders: undefined,
            files: [],
            
        }
    },
    methods: {

    },
}
</script>

<style></style>