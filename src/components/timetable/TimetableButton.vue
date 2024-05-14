<template>
  <div>
    <div>
      <div class="justify-content-end d-flex">
        <el-button type="primary" plain @click="dialogEventVisible = true"
          >Add event</el-button
        >
        <el-button type="primary" plain @click="dialogEventVisible = true"
          >Add loop event</el-button
        >
        <el-button type="primary" plain @click="dialogImportVisible = true"
          >Import timetable</el-button
        >
        <el-button type="primary" plain @click="getDataFromGoogleCalendar"
          >Update data from Calendar</el-button
        >
        <el-button type="primary" plain @click="confirmSynchronizeCalendar"
          >Synchronize with Calendar</el-button
        >
        <el-button type="primary" plain @click="dialogRemindVisible = true"
          >Remind me</el-button
        >
        <el-button type="danger" plain @click="deleteTimetable">Remove</el-button>
      </div>
      <div class="mt-2 offset-4">
        <p class="text-end">
          <i class="text-muted"
            ><small
              >Nếu muốn hiển thị dữ liệu từ Google Calendar vào thời khoá biểu, chọn
              Update data from Calendar. Về vấn đề đồng bộ hoá, chọn Synchronize with
              Calendar và dữ liệu trong thời khoá biểu của bạn sẽ được update vào tài
              khoản Google Calendar.
            </small></i
          >
        </p>
      </div>
      <el-dialog v-model="dialogImportVisible" title="Import timetable" width="720">
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
            <el-button type="info" plain @click="dialogImportVisible = false"
              >Close</el-button
            >
          </div>
        </div>
      </el-dialog>
      <el-dialog v-model="dialogRemindVisible" title="Remind me" width="720">
        <div class="py-4">
          <p class="text-center">
            Please remind me before <el-input-number v-model="remindTime" />
          </p>
          <p class="text-end">
            <i
              ><small class="text-muted"
                >Thông báo hẹn giờ sẽ chỉ có hiệu quả với những sự kiện được cập nhật sau
                khi chỉnh sửa thời gian và được đồng bộ với Google Calendar. Những sự kiện
                trước đó sẽ không có hiệu quả. Tương tự với việc tắt hẹn giờ. <br />Bật
                hẹn giờ đồng nghĩa với việc bật đồng bộ. Tuy nhiên, tắt hẹn giờ sẽ không
                tắt chế độ đồng bộ.
              </small></i
            >
          </p>
          <div class="d-flex justify-content-end">
            <el-button type="primary" @click="updateRemindTime">Save</el-button>
            <el-button type="danger" @click="turnOffRemindTime">Turn off</el-button>
            <el-button type="info" plain @click="dialogRemindVisible = false"
              >Close</el-button
            >
          </div>
        </div>
      </el-dialog>
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
  </div>
</template>

<script>
import axios from "axios";
import router from "../../router/index.ts";
import IconImport from "../icons/import/IconImport.vue";
import IconButtonImport from "../icons/import/IconButtonImport.vue";
import { getHeaderConfig } from "../../utils/ApiHandler.js";
import GoogleGapiHandler from "../../utils/GoogleGapiHandler.js";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getEvent,
  convertEventFromGoogleCalendar,
  convertEventToGoogleCalendar,
} from "../../utils/EventHandler.js";
import { reactive } from "vue";
import { getDateOnly, getTimeOnly, getTime } from "../../utils/DateConverter.js";

export default {
  components: {
    IconImport,
    IconButtonImport,
  },
  props: {
    events: Array,
    timetable: Object,
  },
  data() {
    return {
      fileUpload: undefined,
      ggGapiHandler: undefined,
      dialogImportVisible: false,
      dialogRemindVisible: false,
      dialogEventVisible: false,
      event: reactive({
        title: "",
        description: "",
        from: new Date(),
        to: new Date(),
        fromTime: "",
        toTime: "",
        location: "",
      }),
      remindTime: -1,
      askForRequest: false,
    };
  },
  async mounted() {
    this.ggGapiHandler = new GoogleGapiHandler();
    this.remindTime = this.timetable.remindTime;
    console.log(this.timetable);
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
        this.addEventToGoogleCalendar(data);
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
    setDefaultEventParam(event) {
      this.event.from = event;
      this.event.to = event;
      this.event.start = event;
      this.event.end = event;
    },
    // import timetable

    importTimetable() {
      var formData = new FormData();
      formData.append("image", this.fileUpload);
      axios
        .post(
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

    // get data from google

    getDataFromGoogleCalendar() {
      this.handleAuthClick();
      gapi.client.load("calendar", "V3", this.listEvents.bind(this));
      this.listEvents();
    },
    handleAuthClick() {
      if (this.askForRequest) {
        return;
      }
      this.ggGapiHandler.tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
          throw resp;
        }
      };
      if (gapi.client.getToken() === null) {
        this.ggGapiHandler.tokenClient.requestAccessToken({ prompt: "consent" });
      } else {
        this.ggGapiHandler.tokenClient.requestAccessToken({ prompt: "" });
      }
      this.askForRequest = true;
    },

    async listEvents() {
      let response;
      try {
        const request = {
          calendarId: "primary",
          showDeleted: false,
          singleEvents: true,
          orderBy: "startTime",
        };
        response = await gapi.client.calendar.events.list(request);
        console.log(response.result.items);
        this.$emit("synchronizeCalendar", response.result.items);
      } catch (err) {
        console.log(err.message);
        return;
      }
    },

    // synchronize

    confirmSynchronizeCalendar() {
      ElMessageBox.confirm(
        "Thời khoá biểu sẽ được cập nhật vào Google Calendar của bạn. Tiếp tục?",
        "Warning",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          gapi.client.load("calendar", "V3", this.addEventToGoogleCalendar.bind(this));
          this.synchronizeWithGoogleCalendar();
          ElMessage({
            message: "Đồng bộ hoá thành công",
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

    addEventToGoogleCalendar() {
      console.log(this.events);
      this.events.forEach((appEvent) => {
        this.addEventToGoogleCalendar(appEvent);
      });
    },

    addEventToGoogleCalendar(appEvent) {
      let event = convertEventToGoogleCalendar(
        appEvent.start,
        appEvent.end,
        appEvent.title,
        appEvent.content,
        this.timetable.remindTime
      );
      const request = gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });

      request.execute(function (event) {
        console.log("Event created: " + event.htmlLink);
      });
    },

    synchronizeWithGoogleCalendar() {
      axios
        .post(import.meta.env.VITE_API + "/timetable/synchronize", getHeaderConfig())
        .catch((e) => {
          console.error(e.message);
        });
    },

    updateRemindTime() {
      axios
        .post(
          import.meta.env.VITE_API + "/timetable/remind/" + this.remindTime,
          {},
          getHeaderConfig()
        )
        .then(() => {
          ElMessage({
            type: "success",
            message: "Cập nhật thành công",
          });
        })
        .catch((e) => {
          ElMessage({
            type: "error",
            message: e.message,
          });
        });
      this.dialogRemindVisible = false;
    },

    turnOffRemindTime() {
      axios
        .post(import.meta.env.VITE_API + "/timetable/remind/-1", {}, getHeaderConfig())
        .then(() => {
          ElMessage({
            type: "success",
            message: "Cập nhật thành công",
          });
        })
        .catch((e) => {
          ElMessage({
            type: "error",
            message: e.message,
          });
        });
      this.dialogRemindVisible = false;
      this.timetable.remindTime = undefined;
    },

    // delete timetable
    deleteTimetable() {
      ElMessageBox.confirm(
        "Thời khoá biểu của bạn sẽ bị xoá vĩnh viễn. Tiếp tục?",
        "Warning",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      ).then(() => {
        axios
          .delete(import.meta.env.VITE_API + "/timetable", getHeaderConfig())
          .then(() => {
            ElMessage({
              type: "success",
              message: "Delete completed",
            });
            this.$emit("refreshCalendar");
          })
          .catch((e) => {
            ElMessage({
              type: "error",
              message: e.message,
            });
          });
      });
    },
  },
};
</script>

<style scoped></style>
