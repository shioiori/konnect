<template>
  <div>
    <div>
      <div class="ttb-button justify-content-end d-flex">
        <!-- <button @click="handleAuthClick" ref="authorizeButton">Authorize</button> -->
        <timetable-add-event-button
          :timetable="timetable"
          @add-event-to-google-calendar="addEventToGoogleCalendar"
          @refresh-calendar="refreshCalendar"
        />
        <timetable-add-loop-event-button ></timetable-add-loop-event-button>
        
        <timetable-import-button @refresh-calendar="refreshCalendar" />
        <timetable-update-data-from-calendar-button
          ref="updateDataFromGoogleCalendarButton"
          @synchronize-calendar="synchronizeCalendar"
          @list-events="listEvents"
        />
        <timetable-synchronize-with-calendar-button
          @add-events-to-google-calendar="addEventsToGoogleCalendar"
        />
        <timetable-remind-button :timetable="timetable" />
        <timetable-delete-button @refresh-calendar="refreshCalendar" />
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
    </div>
  </div>
</template>

<script>
import TimetableAddEventButton from "./TimetableAddEventButton.vue";
import TimetableAddLoopEventButton from "./TimetableAddLoopEventButton.vue";
import TimetableImportButton from "./TimetableImportButton.vue";
import TimetableUpdateDataFromCalendarButton from "./TimetableUpdateDataFromCalendarButton.vue";
import TimetableSynchronizeWithCalendarButton from "./TimetableSynchronizeWithCalendarButton.vue";
import TimetableRemindButton from "./TimetableRemindButton.vue";
import TimetableDeleteButton from "./TimetableDeleteButton.vue";

import { ElMessage } from "element-plus";
import * from "../../utils/GoogleGapiHandler.js";
import { convertEventToGoogleCalendar } from "../../utils/EventHandler.js";

import { loadScript } from "vue-plugin-load-script";
export default {
  components: {
    TimetableAddEventButton,
    TimetableAddLoopEventButton,
    TimetableDeleteButton,
    TimetableImportButton,
    TimetableRemindButton,
    TimetableSynchronizeWithCalendarButton,
    TimetableUpdateDataFromCalendarButton,
  },
  props: {
    events: Array,
    timetable: Object,
  },
  watch: {
    timetable(oldValue, newValue) {},
  },
  data() {
    return {
      loadScript: false,
      authorize: false,
    };
  },
  created() {
    this.loadGapiScript().then(() => {
      //this.handleAuthClick();
    });
  },
  methods: {
    loadGapiScript() {
      loadScript("https://apis.google.com/js/api.js").then(() => {
        gapiLoaded();
      });
      loadScript("https://accounts.google.com/gsi/client").then(() => {
        gisLoaded();
        var enable = handleAuthClick();
        while (!enable){
          setTimeout(1000 * 10, () => {
            enable = handleAuthClick()
          });
        }
      });
    },
    refreshCalendar() {
      this.$emit("refreshCalendar");
    },
    synchronizeCalendar() {
      this.$emit("synchronizeCalendar");
    },
    getDataFromGoogleCalendar() {
      this.listEvents();
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
        gapi.client.load("calendar", "V3", this.addEventToGoogleCalendar);
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
      } catch (e) {
        if (error) {
          console.log(error);
          console.log(e);
          return;
        }
        this.addEventToGoogleCalendar(appEvent, e);
      }
    },
    async listEvents(error) {
      let response;
      try {
        const request = {
          calendarId: "primary",
          showDeleted: false,
          singleEvents: true,
          orderBy: "startTime",
        };
        response = await gapi.client.calendar.events.list(request);
        this.synchronizeCalendar();
      } catch (err) {
        gapi.client.load("calendar", "V3", this.listEvents.bind(this));
        this.listEvents(err);
        if (error)
          ElMessage({
            message: err.message,
            type: "error",
          });
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
