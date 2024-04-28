<template>
    <div class="container-fluid">
        <div class="row">
            <div :class="['col-' + (this.isSidebarCollapse ? '1' : '2')]" style="padding: 0;">
                <the-sidebar @toggle-sidebar="onSidebarCollapse" />
            </div>
            <div :class="['col-' + (this.isSidebarCollapse ? '11' : '10')]" style="padding: 0;">
                <div>
                    <the-navbar @toggle-sidebar="onSidebarCollapse" />
                </div>
                <div class="container">
                    <div class="content">
                        <div>
                            <TimetableButton @refresh-calendar="getEventsInDatabase" 
                            @synchronize-calendar="synchronizeCalendar"/>
                        </div>
                        <div>
                            <vue-cal :selected-date="currentDate" :time-from="0 * 60" :time-to="23 * 60"
                                :disable-views="['years']" :events="events">
                            </vue-cal>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import axios from 'axios'
import { getHeaderConfig } from '../utils/ApiHandler.js'
import { getTime, getDateOnly, dateTimeToJSDate, getStartDateInRange } from '../utils/DateConverter.js'
import { getEvent, convertEventFromGoogleCalendar, convertEventToGoogleCalendar } from '../utils/EventHandler.js'
import TheNavbar from '../components/layout/TheNavbar.vue'
import TheSidebar from '../components/layout/TheSidebar.vue'
import TimetableButton from '../components/timetable/TimetableButton.vue'

export default {
    components: {
        VueCal,
        TimetableButton,
        TheNavbar,
        TheSidebar
    },
    data() {
        return {
            currentDate: new Date(),
            events: [
                {
                    start: '2018-11-16 10:30',
                    end: '2018-11-16 11:30',
                    // You can also define event dates with Javascript Date objects:
                    // start: new Date(2018, 11 - 1, 16, 10, 30),
                    // end: new Date(2018, 11 - 1, 16, 11, 30),
                    title: 'Doctor appointment',
                    content: '<i class="icon material-icons">local_hospital</i>',
                    class: 'health'
                },
            ],
            isSidebarCollapse: true,
        }
    },
    created() {
        this.getEventsInDatabase();
    },
    methods: {
        async getEventsInDatabase() {
            var res = (await axios.get(import.meta.env.VITE_API + '/timetable', getHeaderConfig())).data;
            if (res.events.length == 0) {
                return;
            }
            this.currentDate = dateTimeToJSDate(res.from);
            this.events = [];
            res.events.forEach(event => {
                var startDate = dateTimeToJSDate(event.from);
                var endDate = dateTimeToJSDate(event.to);
                var date = getStartDateInRange(startDate, endDate, event.day);
                while (new Date(date) <= new Date(endDate)) {
                    let timeRange = getTime(event.code);
                    let startDate = getDateOnly(date) + ' ' + timeRange.start;
                    let endDate = getDateOnly(date) + ' ' + timeRange.end;
                    this.events.push(getEvent(startDate, endDate, event.subjectClass, event.location, timeRange.cssClass));
                    date.setDate(date.getDate() + 7);
                }
            });
        },
        synchronizeCalendar(ggEvents){
            ggEvents.forEach(e => {
                let ev = convertEventFromGoogleCalendar(e);
                this.events.push(ev);
            })
            this.currentDate = new Date();
            console.log(this.events);
        }
    },
}
</script>
  
<style>
.vuecal__special-hours {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px;
}

.shift1 {
    background-color: #f0fff1;
    color: #81d58b;
}

.shift2 {
    background-color: #f0f6ff;
    color: #689bee;
}

.shift3 {
    background-color: #fcf0ff;
    color: #d168ee;
}

.shift4 {
    background-color: #ffeee2;
    color: #ee6868;
}

.gg-event {
    background-color: #fdffe2;
    color: #cdcc6a;
}
</style>