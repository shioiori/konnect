<template>
    <div>
        <el-button type="primary" plain @click="getDataFromGoogleCalendar"
          >Update data from Calendar</el-button
        >
    </div>
</template>

<script>

import GoogleGapiHandler from "../../utils/GoogleGapiHandler.js";
import { ElMessage } from "element-plus";

export default {
  data() {
    return {
      askForRequest: false,
      ggGapiHandler: undefined,
    }
  },
  props: {
    events: Array,
    timetable: Object,
  },
  methods: {
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
        ElMessage({
            message: e.message,
            type: "error",
        });
      }
    },
  },
}
</script>