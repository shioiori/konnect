<template>
    <div>
        <el-button type="primary" plain @click="dialogVisible = true"
          >Add event</el-button
        >
        
      <el-dialog v-model="dialogEventVisible" title="Add event" width="720">
        <div class="py-4">
          <el-form :model="event">
            <el-form-item label="Tiêu đề" prop="title" required>
              <el-input v-model="event.title" />
            </el-form-item>
            <el-form-item label="Từ" required>
              <el-col :span="11">
                <el-form-item prop="date1">
                  <el-date-picker
                    v-model="event.from"
                    type="date"
                    aria-label="Pick a date"
                    placeholder="Pick a date"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col class="text-center" :span="2">
                <span class="text-gray-500">-</span>
              </el-col>
              <el-col :span="11">
                <el-form-item prop="date2">
                  <el-time-picker
                    v-model="event.fromTime"
                    aria-label="Pick a time"
                    placeholder="Pick a time"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="Activity time" required>
              <el-col :span="11">
                <el-form-item prop="date1">
                  <el-date-picker
                    v-model="event.to"
                    type="date"
                    aria-label="Pick a date"
                    placeholder="Pick a date"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col class="text-center" :span="2">
                <span class="text-gray-500">-</span>
              </el-col>
              <el-col :span="11">
                <el-form-item prop="date2">
                  <el-time-picker
                    v-model="event.toTime"
                    aria-label="Pick a time"
                    placeholder="Pick a time"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="Nội dung" prop="content">
              <el-input v-model="event.description" type="textarea" />
            </el-form-item>

            <el-form-item label="Địa điểm" prop="location">
              <el-input v-model="event.location" type="textarea" />
            </el-form-item>
            <div class="d-flex justify-content-end">
              <el-form-item>
                <el-button type="primary" @click="addEvent"> Create </el-button>
                <el-button type="info" @click="dialogEventVisible = false"
                  >Cancel</el-button
                >
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import { ElMessage } from "element-plus";
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";

export default {
    data() {
        return {
            dialogVisible: false,
            event: reactive({
                title: "",
                description: "",
                from: new Date(),
                to: new Date(),
                fromTime: "",
                toTime: "",
                location: "",
            }),
        }
    },
    methods: {
        addEvent() {
            console.log(this.event);
            let data = {
                title: this.event.title,
                description: this.event.description,
                location: this.event.location,
                start: getDateOnly(this.event.from) + " " + getTimeOnly(this.event.fromTime),
                end: getDateOnly(this.event.to) + " " + getTimeOnly(this.event.to),
            };
            console.log(data);
            if (this.timetable.isSynchronize) {
                if (!this.askForRequest) {
                this.handleAuthClick();
                }
                this.$emit('addEventToGoogleCalendar', data);
            } else {
                axios
                .post(
                    import.meta.env.VITE_API + "/timetable/event",
                    {
                        file: this.fileUpload,
                    },
                    getHeaderConfig("multipart/form-data")
                )
                .then((res) => {
                    ElMessage({
                        message: res.message,
                        type: res.type,
                    });
                    this.$emit("refreshCalendar");
                })
                .catch((e) => {
                    ElMessage({
                        message: e.message,
                        type: "error",
                    });
                });
            }
        },
    }
}
</script>