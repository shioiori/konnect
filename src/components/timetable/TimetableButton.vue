<template>
  <div>
    <div>
      <div class="ttb-button justify-content-end d-flex">
        <!-- <button @click="handleAuthClick" ref="authorizeButton">Authorize</button> -->
        <timetable-add-event-button
          ref="addEventButton"
          :timetable="timetable"
          @add-event-to-google-calendar="addEventSynchronize"
          @refresh-calendar="refreshCalendar"
          @undo-event-drag="undoEventDrag"
          @remove-event-synchronize="removeEventSynchronize"
        />
        <!-- <timetable-add-loop-event-button /> -->
        <timetable-import-button
          @refresh-calendar="refreshCalendar"
          :timetable="timetable"
          @list-events="listEvents"
        />
        <timetable-update-data-from-calendar-button
          ref="updateDataFromGoogleCalendarButton"
          @list-events="listEvents"
        />
        <!-- <timetable-synchronize-with-calendar-button
          @add-events-to-google-calendar="addEventsToGoogleCalendar"
        /> -->
        <timetable-remind-button :timetable="timetable" />
        <timetable-delete-button
          :timetable="timetable"
          @refresh-calendar="refreshCalendar"
          @remove-all-events-synchronized="removeAllEventsSynchronized"
        />
      </div>
      <div class="mt-2 offset-4">
        <p class="text-end">
          <i class="text-muted"
            ><small
              >Nếu muốn kết hợp với sự kiện từ Google Calendar nhưng tránh đồng bộ hoá,
              chọn Kéo dữ liệu từ Google Calendar. Nếu bật đồng bộ hoá, sự kiện của bạn sẽ
              được cập nhật vào tài khoản Google Calendar và không được lưu nội bộ.
            </small></i
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import TimetableAddEventButton from "./TimetableAddEventButton.vue";
import TimetableAddLoopEventButton from "./TimetableAddLoopEventButton.vue";
import TimetableImportButton from "./TimetableImportButton.vue";
import TimetableUpdateDataFromCalendarButton from "./TimetableUpdateDataFromCalendarButton.vue";
//import TimetableSynchronizeWithCalendarButton from "./TimetableSynchronizeWithCalendarButton.vue";
import TimetableRemindButton from "./TimetableRemindButton.vue";
import TimetableDeleteButton from "./TimetableDeleteButton.vue";

import { ElMessage } from "element-plus";
import { gapiLoaded, gisLoaded, handleAuthClick } from "../../utils/GoogleGapiHandler.js";
import { convertEventToGoogleCalendar } from "../../utils/EventHandler.js";

import { loadScript } from "vue-plugin-load-script";
export default {
  components: {
    TimetableAddEventButton,
    TimetableAddLoopEventButton,
    TimetableDeleteButton,
    TimetableImportButton,
    TimetableRemindButton,
    //TimetableSynchronizeWithCalendarButton,
    TimetableUpdateDataFromCalendarButton,
  },
  props: {
    events: Array,
    timetable: Object,
  },
  watch: {
    timetable(oldValue, newValue) {
      if (oldValue && oldValue.isSynchronize) {
        this.handleAuthorize(this.listEvents);
      }
    },
    events(oldValue, newValue) {},
  },
  data() {
    return {
      loadScript: false,
      authorize: false,
    };
  },
  created() {
    this.registerListenSynchornize();
  },
  mounted() {
    this.loadGapiScript();
  },
  methods: {
    openEventDialog(event, e) {
      //this.$refs.addEventButton.addEventByClicked(event);
      this.$refs.addEventButton.openEventDialog(event, e);
    },
    updateDragEvent(obj) {
      this.$refs.addEventButton.updateDragEvent(obj);
    },
    handleAuthorize(callback) {
      setTimeout(() => {
        this.authorize = true;
        var x = handleAuthClick(callback);
      }, 1000);
    },
    loadGapiScript() {
      loadScript("https://apis.google.com/js/api.js").then(() => {
        gapiLoaded();
      });
      loadScript("https://accounts.google.com/gsi/client").then(() => {
        gisLoaded();
      });
    },
    refreshCalendar() {
      this.$emit("refreshCalendar");
    },
    undoEventDrag(dragEvent) {
      this.$emit("undoEventDrag", dragEvent);
    },
    addEventsToGoogleCalendar(error) {
      try {
        this.events.forEach((appEvent) => {
          this.addEventToGoogleCalendar(appEvent);
        });
        ElMessage({
          type: "success",
          message: "Thêm sự kiện thành công",
        });
      } catch (e) {
        if (error) {
          ElMessage({
            type: "error",
            message: e.message,
          });
          return;
        }
        var reload = () => this.addEventsToGoogleCalendar(e);
        this.handleAuthorize(reload);
      }
    },
    addEventToGoogleCalendar(appEvent, error, insertMultiple) {
      try {
        let event = convertEventToGoogleCalendar(
          appEvent.start,
          appEvent.end,
          appEvent.title,
          appEvent.content,
          appEvent.description,
          this.timetable.remindTime
        );
        const request = gapi.client.calendar.events.insert({
          calendarId: "primary",
          resource: event,
        });
        request.execute((event) => {
          if (!insertMultiple) this.$emit("addEventSynchronize", event);
        });
      } catch (e) {
        if (error) {
          ElMessage({
            type: "error",
            message: e.message,
          });
          return;
        } else {
          gapi.client.load("calendar", "V3", this.addEventToGoogleCalendar(appEvent, e));
        }
      }
    },
    addEventSynchronize(event) {
      this.addEventToGoogleCalendar(event, null, false);
    },
    async listEvents(error, isIntergrate) {
      if (isIntergrate) {
        this.$emit("migrateData");
      }
      if (!this.authorize) {
        ElMessage({
          type: "error",
          message: "Chưa xác minh tài khoản Google",
        });
        this.handleAuthorize(this.listEvents);
        return;
      }
      let response;
      try {
        const request = {
          calendarId: "primary",
          showDeleted: false,
          singleEvents: true,
          orderBy: "startTime",
        };
        response = await gapi.client.calendar.events.list(request);
        this.$emit("synchronizeCalendar", response.result.items);
        ElMessage({
          type: "success",
          message: "Đọc dữ liệu từ Google Calendar thành công",
        });
      } catch (err) {
        if (error) {
          ElMessage({
            message: err.message,
            type: "error",
          });
        } else {
          this.authorize = false;
          gapi.client.load("calendar", "V3", this.listEvents(err));
        }
      }
    },
    removeAllEventsSynchronized() {
      this.events.forEach((event) => {
        this.removeEventSynchronize(event.id, false);
      });
      this.refreshCalendar();
      ElMessage({
        type: "success",
        message: "Đã xoá bỏ toàn bộ sự kiện trong Google Calendar",
      });
    },
    removeEventSynchronize(id, alert, error) {
      try {
        const request = gapi.client.calendar.events.delete({
          calendarId: "primary",
          eventId: id,
        });
        request.execute(function (event) {});
        this.$emit("removeEventSynchronize", id);
        if (alert)
          ElMessage({
            type: "success",
            message: "Xoá thành công",
          });
      } catch (e) {
        if (error) {
          ElMessage({
            type: "error",
            message: e.message,
          });
          return;
        } else {
          gapi.client.load("calendar", "V3", this.deleteEvent(id, alert, e));
        }
      }
    },
    registerListenSynchornize() {
      this.emitter.on("synchronizeTimetable", (state) => {
        this.timetable.isSynchronize = state;
        if (!state) {
          this.refreshCalendar();
          return;
        }
        if (this.authorize) {
          this.listEvents();
        } else {
          this.handleAuthorize(this.listEvents);
        }
      });
    },
  },
};
</script>

<style scoped>
.ttb-button div {
  margin-left: 0.5rem;
}
</style>
