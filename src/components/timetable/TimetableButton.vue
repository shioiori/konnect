<template>
  <div>
    <div>
      <div class="justify-content-end d-flex">
        <timetable-add-event-button @add-event-to-google-calendar="addEventToGoogleCalendar" @refresh-calendar="refreshCalendar"/>
        <timetable-add-loop-event-button/>
        <timetable-import-button @refresh-calendar="refreshCalendar"/>
        <timetable-update-data-from-calendar-button @synchronize-calendar="synchronizeCalendar"/>
        <timetable-synchronize-with-calendar-button @add-events-to-google-calendar="addEventsToGoogleCalendar"/>
        <timetable-remind-button :timetable="timetable"/>
        <timetable-delete-button @refresh-calendar="refreshCalendar"/>
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

import IconImport from "../icons/import/IconImport.vue";
import IconButtonImport from "../icons/import/IconButtonImport.vue";
import GoogleGapiHandler from "../../utils/GoogleGapiHandler.js";
import {
  convertEventToGoogleCalendar,
} from "../../utils/EventHandler.js";

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
      ggGapiHandler: undefined,
    };
  },
  mounted() {
    this.ggGapiHandler = new GoogleGapiHandler();
  },
  methods: {
    refreshCalendar(){
      this.$emit("refreshCalendar");
    },
    synchronizeCalendar(){
      this.$emit("synchronizeCalendar");
    },
    addEventsToGoogleCalendar() {
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
  },
};
</script>

<style scoped></style>
