<template>
  <div class="container">
    <div class="content">
      <div>
        <timetable-button
          @refresh-calendar="refreshCalendar"
          @synchronize-calendar="synchronizeCalendar"
          @undo-event-drag="undoEventDrag"
          @remove-event-synchronize="removeEventSynchronize"
          @add-event-synchronize="addEventSynchronize"
          @migrate-data="changeMigrateDataState"
          :events="events"
          :timetable="timetable"
          ref="timetableButton"
        />
      </div>
      <div>
        <timetable-bar
          :timetable="timetable"
          @filter-event="filterEvent"
          @get-events-in-database="getEventsInDatabase"
        />
      </div>
      <div>
        <vue-cal
          :selected-date="currentDate"
          :time-from="0 * 60"
          :time-to="23 * 60"
          :disable-views="['day', 'years']"
          :events="showEvents"
          :editable-events="{
            title: false,
            drag: true,
            resize: false,
            delete: false,
            create: false,
          }"
          :on-event-dblclick="openEventDialog"
          @event-drop="onEventDrop"
          locale="vi"
        >
          <!-- @cell-click="openEventDialog($event)"
           -->
        </vue-cal>
      </div>
    </div>
  </div>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import axios from "axios";
import { getHeaderConfig } from "../utils/ApiHandler.js";
import {
  getTime,
  getDateOnly,
  dateTimeToJSDate,
  getStartDateInRange,
  getFormattedDate,
} from "../utils/DateConverter.js";
import {
  getEvent,
  convertEventFromGoogleCalendar,
  convertEventToGoogleCalendar,
} from "../utils/EventHandler.js";
import TimetableButton from "../components/timetable/TimetableButton.vue";
import TimetableBar from "../components/timetable/TimetableBar.vue";
import { ElMessage } from "element-plus";

export default {
  components: {
    VueCal,
    TimetableButton,
    TimetableBar,
  },
  data() {
    return {
      currentDate: new Date(),
      events: [
        {
          start: "2018-11-16 10:30",
          end: "2018-11-16 11:30",
          // You can also define event dates with Javascript Date objects:
          // start: new Date(2018, 11 - 1, 16, 10, 30),
          // end: new Date(2018, 11 - 1, 16, 11, 30),
          title: "Doctor appointment",
          content: '<i class="icon material-icons">local_hospital</i>',
          class: "health",
        },
      ],
      showEvents: [],
      timetable: undefined,
      migrateData: false,
    };
  },
  mounted() {
    this.refreshCalendar();
  },
  methods: {
    changeMigrateDataState() {
      this.migrateData = true;
    },
    async refreshCalendar(backtoDate) {
      var res = (
        await axios.get(import.meta.env.VITE_API + "/timetable", getHeaderConfig())
      ).data;
      this.timetable = res;
      if (this.timetable.isSynchronize) {
        this.$refs.timetableButton.listEvents();
        return;
      }
      if (!backtoDate && this.timetable.events.length > 0) {
        //       this.currentDate = new Date(res.from);
      } else {
        this.currentDate = new Date();
      }
      this.events = [];
      this.timetable.events.forEach((event) => {
        if (event.isLoopPerDay) {
          var date = getStartDateInRange(event.from, event.to, event.day);
          while (new Date(date) <= new Date(event.to)) {
            let startDate = getDateOnly(date) + " " + event.periodStart;
            let endDate = getDateOnly(date) + " " + event.periodEnd;
            this.events.push(getEvent(event, startDate, endDate));
            date.setDate(date.getDate() + 7);
          }
        } else {
          this.events.push(getEvent(event));
        }
      });
      this.showEvents = this.events;
    },
    synchronizeCalendar(ggEvents) {
      if (!ggEvents) return;
      console.log(this.migrateData);
      if (!this.migrateData) this.events = [];
      else this.migrateData = false;
      ggEvents.forEach((e) => {
        let ev = convertEventFromGoogleCalendar(e);
        this.events.push(ev);
      });
      this.showEvents = this.events;
      this.currentDate = new Date();
    },
    removeEventSynchronize(id) {
      let idx = this.events.findIndex((obj) => obj.id === id);
      this.events.splice(idx, 1);
    },
    addEventSynchronize(event) {
      let ev = convertEventFromGoogleCalendar(event);
      this.events.push(ev);
      ElMessage({
        type: "success",
        message: "Thêm sự kiện thành công",
      });
    },
    openEventDialog(event, e) {
      this.$refs.timetableButton.openEventDialog(event, e);
    },
    filterEvent(categories) {
      this.showEvents = this.events.filter((obj) => categories.includes(obj.category));
    },
    onEventDrop(obj) {
      this.$refs.timetableButton.updateDragEvent(obj);
    },
    undoEventDrag(dragEvent) {
      delete dragEvent.originalEvent.eid;
      let idx = this.events.findIndex((obj) => obj.id === dragEvent.event.id);
      this.events[idx] = getEvent(dragEvent.originalEvent);
    },
  },
};
</script>

<style>
.vuecal__special-hours {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
}

.shift1,
.google,
.gg-event {
  background-color: #f0fff1;
  color: #81d58b;
}

.shift2,
.user {
  background-color: #f0f6ff;
  color: #689bee;
}

.shift3,
.timetable {
  background-color: #fcf0ff;
  color: #d168ee;
}

.shift4,
.unclassified {
  background-color: #ffeee2;
  color: #ee6868;
}

.vuecal__menu {
  background-color: var(--el-color-primary-light-5);
}

.vuecal__title-bar {
  background-color: var(--el-color-primary-light-9);
}

.vuecal__event-title {
  padding-top: 0.5rem;
}
</style>
