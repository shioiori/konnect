<template>
  <div>
    <div>
      <div class="ttb-button justify-content-end d-flex">
        <!-- <button @click="handleAuthClick" ref="authorizeButton">Authorize</button> -->
        <timetable-add-event-button
          ref="addEventButton"
          :timetable="timetable"
          @add-event-to-google-calendar="addEventToGoogleCalendar"
          @refresh-calendar="refreshCalendar"
        />
        <!-- <timetable-add-loop-event-button /> -->
        <timetable-import-button @refresh-calendar="refreshCalendar" />
        <timetable-update-data-from-calendar-button
          ref="updateDataFromGoogleCalendarButton"
          @list-events="listEvents"
        />
        <!-- <timetable-synchronize-with-calendar-button
          @add-events-to-google-calendar="addEventsToGoogleCalendar"
        /> -->
        <timetable-remind-button :timetable="timetable" />
        <timetable-delete-button @refresh-calendar="refreshCalendar" />
      </div>
      <div class="mt-2 offset-4">
        <p class="text-end">
          <i class="text-muted"
            ><small
              >Nếu muốn kết hợp với sự kiện từ Google Calendar nhưng tránh đồng bộ hoá,
              chọn Update data from Calendar. Nếu bật đồng bộ hoá, sự kiện của bạn sẽ được
              cập nhật vào tài khoản Google Calendar và không được lưu nội bộ.
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
      console.log(oldValue);
      console.log(newValue);
      if (oldValue && oldValue.isSynchronize) {
        this.handleAuthorize(this.listEvents);
      }
    },
  },
  data() {
    return {
      loadScript: false,
      authorize: false,
    };
  },
  mounted() {
    this.loadGapiScript();
  },
  methods: {
    openEventDialog(event) {
      this.$refs.addEventButton.addEventByClicked(event);
    },
    handleAuthorize(callback) {
      //if (this.authorize) return;
      setTimeout(() => {
        this.authorize = true;
        handleAuthClick(callback);
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
    addEventsToGoogleCalendar(error) {
      console.log(this.events);
      try {
        this.events.forEach((appEvent) => {
          this.addEventToGoogleCalendar(appEvent);
        });
      } catch (e) {
        if (error) {
          console.log(error);
          console.log(e);
          return;
        }
        this.addEventsToGoogleCalendar(e);
      }
    },
    addEventToGoogleCalendar(appEvent, error) {
      try {
        let event = convertEventToGoogleCalendar(
          appEvent.start,
          appEvent.end,
          appEvent.title,
          appEvent.content,
          this.timetable.remindTime
        );
        console.log(event);
        const request = gapi.client.calendar.events.insert({
          calendarId: "primary",
          resource: event,
        });
        request.execute(function (event) {
          console.log("Event created: " + event.htmlLink);
        });
      } catch (e) {
        if (error) {
          console.log(error);
          console.log(e);
          return;
        } else {
          gapi.client.load("calendar", "V3", this.addEventToGoogleCalendar(appEvent, e));
        }
      }
    },
    async listEvents(error) {
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
          gapi.client.load("calendar", "V3", this.listEvents(err));
        }
      }
    },
  },
};
</script>

<style scoped>
.ttb-button div {
  margin-left: 0.5rem;
}
</style>
