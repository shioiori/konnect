<template>
  <div>
    <el-button type="primary" plain @click="openAddDialog">{{ buttonContent }}</el-button>

    <el-dialog v-model="dialogVisible" :title="dialogContent" width="720">
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
          <el-form-item label="Đường dẫn" v-if="event.link">
            <el-link :href="event.link" type="primary" target="_blank">link</el-link>
          </el-form-item>
          <div class="d-flex justify-content-end">
            <el-form-item>
              <el-button
                type="primary"
                @click="addEvent"
                v-if="event.category != 'Google' && event.category != 'Timetable'"
              >
                Save
              </el-button>
              <el-button
                type="danger"
                @click="deleteEvent"
                v-if="
                  (action == 'edit' && event.category != 'Timetable') ||
                  event.category == 'Google'
                "
              >
                Delete
              </el-button>
              <el-button
                type="info"
                @click="
                  dialogVisible = false;
                  resetForm();
                "
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
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";
import { getHeaderConfig } from "../../utils/ApiHandler.js";
import {
  getDateOnly,
  getTimeOnly,
  getFormattedDate,
  JSDateToCSharpDate,
} from "../../utils/DateConverter.js";
import { reactive, watch } from "vue";
export default {
  data() {
    return {
      dialogVisible: false,
      formEvent: reactive({
        title: "",
        description: "",
        start: new Date(),
        end: new Date(),
        location: "",
      }),
      event: {},
      action: "add",
      buttonContent: "Thêm sự kiện",
      dialogContent: "Thêm sự kiện",
    };
  },
  props: {
    timetable: Object,
  },
  created() {
    this.event = { ...this.formEvent };
  },
  watch: {
    timetable(oldValue, newValue) {},
    action() {
      if (this.action == "add") {
        this.dialogContent = "Thêm sự kiện";
      } else {
        this.dialogContent = "Chỉnh sửa sự kiện";
      }
    },
  },
  methods: {
    openEventDialog(event, e) {
      this.action = "edit";
      this.event = event;
      this.dialogVisible = true;
      this.dialogContent = "Chỉnh sửa sự kiện";
      console.log(this.event);
    },
    openAddDialog() {
      this.action = "add";
      this.event = { ...this.formEvent };
      this.dialogVisible = true;
    },
    updateDragEvent(obj) {
      try {
        this.event = obj.event;
        this.updateEvent();
      } catch (ex) {
        this.$emit("undoEventDrag", obj);
      }
    },
    addEventByClicked(event) {
      this.event.start = event;
      this.event.end = event;
      //this.event.end.setTime(this.event.end.getDate() + 2 * 60 * 60 * 1000);
      this.dialogVisible = true;
    },
    addEvent() {
      console.log(this.action);
      if (this.action != "add") {
        this.updateEvent();
        return;
      }
      if (this.timetable.isSynchronize) {
        this.$emit("addEventToGoogleCalendar", this.event);
        this.dialogVisible = false;
        this.resetForm();
        return;
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
      try {
        this.$refs["eventForm"].resetFields();
      } catch (e) {}
    },
    updateEvent() {
      console.log(this.event.category);
      if (this.event.category == "Google" || this.event.category == "Timetable") {
        ElMessage({
          message: "Chưa hỗ trợ kéo thả sự kiện " + this.event.category,
          type: "error",
        });
        throw new Error();
      }
      this.event.from = this.event.start;
      this.event.to = this.event.end;
      axios
        .post(
          import.meta.env.VITE_API + "/timetable/event/" + this.event.id,
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
    },
    deleteEvent() {
      if (this.event.category == "Google") {
        this.$emit("removeEventSynchronize", this.event.id);
        this.dialogVisible = false;
        this.resetForm();
        return;
      }
      ElMessageBox.confirm("Bạn có chắc muốn xoá sự kiện?", "Warning", {
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        axios
          .delete(
            import.meta.env.VITE_API + "/timetable/event/" + this.event.id,
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
      });
    },
  },
};
</script>
