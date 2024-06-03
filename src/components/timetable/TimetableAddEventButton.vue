<template>
  <div>
    <el-button type="primary" plain @click="dialogVisible = true">Thêm sự kiện</el-button>

    <el-dialog v-model="dialogVisible" title="Thêm sự kiện" width="720">
      <div class="py-4">
        <el-form :model="event" label-position="right" label-width="auto" ref="eventForm">
          <el-form-item label="Tiêu đề" required>
            <el-input v-model="event.title" />
          </el-form-item>
          <el-form-item label="Từ" required>
            <el-col :span="9">
              <el-date-picker
                v-model="event.start"
                type="datetime"
                placeholder="Pick a Date"
                format="YYYY-MM-DD HH:mm:ss"
                date-format="MMM DD, YYYY"
                time-format="HH:mm"
              />
            </el-col>
            <el-col class="text-center" :span="2">
              <span class="text-gray-500">đến</span>
            </el-col>
            <el-col :span="9">
              <el-date-picker
                v-model="event.end"
                type="datetime"
                placeholder="Pick a Date"
                format="YYYY-MM-DD HH:mm:ss"
                date-format="MMM DD, YYYY"
                time-format="HH:mm"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="Nội dung">
            <el-input v-model="event.description" type="textarea" />
          </el-form-item>

          <el-form-item label="Địa điểm">
            <el-input v-model="event.location" type="textarea" />
          </el-form-item>
          <div class="d-flex justify-content-end">
            <el-form-item>
              <el-button type="primary" @click="addEvent"> Create </el-button>
              <el-button type="info" @click="dialogVisible = false">Cancel</el-button>
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
import { getDateOnly, getTimeOnly } from "../../utils/DateConverter.js";
import { reactive, watch } from "vue";
export default {
  data() {
    return {
      dialogVisible: false,
      event: reactive({
        title: "",
        description: "",
        start: new Date(),
        end: new Date(),
        location: "",
      }),
    };
  },
  props: {
    timetable: Object,
  },
  watch: {
    timetable(oldValue, newValue) {},
  },
  methods: {
    addEventByClicked(event) {
      this.event.start = event;
      this.event.end = event;
      //this.event.end.setTime(this.event.end.getDate() + 2 * 60 * 60 * 1000);
      this.dialogVisible = true;
    },
    addEvent() {
      console.log(this.timetable.isSynchronize);
      if (this.timetable.isSynchronize) {
        this.$emit("addEventToGoogleCalendar", this.event);
      } else {
        axios
          .post(
            import.meta.env.VITE_API + "/timetable/event",
            this.event,
            getHeaderConfig()
          )
          .then((res) => {
            ElMessage({
              message: res.data.message,
              type: res.data.type,
            });
            this.$emit("refreshCalendar");
            this.dialogVisible = false;
            this.resetForm();
          })
          .catch((e) => {
            ElMessage({
              message: e.message,
              type: "error",
            });
          });
      }
    },
    resetForm() {
      this.$refs["eventForm"].resetFields();
    },
  },
};
</script>
