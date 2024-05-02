<template>
  <div>
    <div>
      <div class="justify-content-end d-flex">
        <el-button type="primary" plain @click="dialogEventVisible = true">Add event</el-button>
        <el-button type="primary" plain @click="dialogImportVisible = true">Import timetable</el-button>
        <el-button type="primary" plain @click="getDataFromGoogleCalendar">Update data from Calendar</el-button>
        <el-button type="primary" plain @click="confirmSynchronizeCalendar">Synchronize with Calendar</el-button>
        <el-button type="primary" plain @click="dialogRemindVisible = true">Remind me</el-button>
        <el-button type="danger" plain @click="deleteTimetable">Remove</el-button>
      </div>
      <div class="mt-2 offset-4">
        <p class="text-end"><i class="text-muted"><small>Nếu muốn hiển thị dữ liệu từ Google Calendar vào thời khoá biểu,
              chọn Update
              data from Calendar. Về vấn đề đồng bộ hoá, chọn Synchronize with Calendar và dữ liệu trong thời khoá biểu
              của
              bạn sẽ được update vào tài khoản Google Calendar.
            </small></i></p>
      </div>
      <el-dialog v-model="dialogImportVisible" title="Import timetable" width="720">
        <div class="text-center py-4">
          <IconImport @click="$refs.file.click()" />
          <h5>Select a file to import</h5>
          <p>Using file export from qldt.utc.edu.vn or download template import
            <el-link type="primary" href="../../assets/template/Import timetable template.xlsx" download>here</el-link>
          </p>
          <div>
            <input type="file" ref="file" @change="handleFileChange($event)" accept="image/*" capture hidden />
            <el-button type="primary" @click="$refs.file.click()">Import</el-button>
            <el-button type="info" plain @click="dialogImportVisible = false">Close</el-button>
          </div>
        </div>
      </el-dialog>
      <el-dialog v-model="dialogRemindVisible" title="Remind me" width="720">
        <div class="py-4">
          <p class="text-center">Please remind me before <el-input-number v-model="remindTime" /></p>
          <p class="text-end"><i><small class="text-muted">Thông báo nhắc nhở sẽ chỉ có hiệu quả với những sự kiện được
                cập nhật
                sau khi chỉnh sửa thời gian và được đồng bộ với Google Calendar. Những sự kiện trước đó sẽ không
                có hiệu quả. Tương tự với việc tắt nhắc nhở.
              </small></i></p>
          <div class="d-flex justify-content-end">
            <el-button type="primary" @click="updateRemindTime">Save</el-button>
            <el-button type="danger" @click="turnOffRemindTime">Turn off</el-button>
            <el-button type="info" plain @click="dialogRemindVisible = false">Close</el-button>
          </div>
        </div>
      </el-dialog>
      <el-dialog v-model="dialogEventVisible" title="Add event" width="720">
        <div class="py-4">
          <el-form :model="event">
            <el-form-item label="Tiêu đề" prop="title" required>
              <el-input v-model="event.title" />
            </el-form-item>
            <el-form-item label="Thời gian" required>
              <el-col :span="11">
                <el-form-item prop="start">
                  <el-time-picker v-model="event.start" label="Pick a time" placeholder="Pick a time"
                    style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col class="text-center" :span="2">
                <span class="text-gray-500">-</span>
              </el-col>
              <el-col :span="11">
                <el-form-item prop="end">
                  <el-time-picker v-model="event.end" label="Pick a time" placeholder="Pick a time" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="Nội dung" prop="content">
              <el-input v-model="event.content" type="textarea" />
            </el-form-item>
            <div class="d-flex justify-content-end">
              <el-form-item>
                <el-button type="primary" @click="addEvent">
                  Create
                </el-button>
                <el-button type="info" @click="dialogEventVisible = false">Cancel</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import router from '../../router/index.ts';
import IconImport from '../icons/import/IconImport.vue';
import IconButtonImport from '../icons/import/IconButtonImport.vue';
import { getHeaderConfig } from '../../utils/ApiHandler.js'
import GoogleGapiHandler from '../../utils/GoogleGapiHandler.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getEvent, convertEventFromGoogleCalendar, convertEventToGoogleCalendar } from '../../utils/EventHandler.js'
import { reactive } from 'vue'

export default {
  components: {
    IconImport,
    IconButtonImport
  },
  props: {
    events: Array,
  },
  data() {
    return {
      fileUpload: undefined,
      ggGapiHandler: undefined,
      dialogImportVisible: false,
      dialogRemindVisible: false,
      dialogEventVisible: false,
      remindTime: -1,
      event: reactive({
        title: '',
        content: '',
        start: '',
        end: '',
        isSynchronize: '',
      })
    }
  },
  async mounted() {
    this.ggGapiHandler = new GoogleGapiHandler();
    this.remindTime = await this.getRemindTime();
  },
  methods: {
    addEvent() {

    },

    // import timetable

    importTimetable() {
      var formData = new FormData();
      formData.append('image', this.fileUpload);
      axios.post(import.meta.env.VITE_API + '/import/timetable', {
        file: this.fileUpload
      }, getHeaderConfig('multipart/form-data')).then((res) => {
        ElMessage({
          message: 'Import success.',
          type: 'success',
        })
        this.$emit('refreshCalendar');
      }).catch(e => {
        ElMessage({
          message: e.message,
          type: 'error',
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
    },
    handleAuthClick() {
      this.ggGapiHandler.tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
          throw (resp);
        }
        gapi.client.load('calendar', 'V3', this.listUpcomingEvents.bind(this));
      };
      if (gapi.client.getToken() === null) {
        this.ggGapiHandler.tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        this.ggGapiHandler.tokenClient.requestAccessToken({ prompt: '' });
      }
    },

    async listUpcomingEvents() {
      let response;
      try {
        const request = {
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime',
        };
        response = await gapi.client.calendar.events.list(request);
        console.log(response.result.items)
        this.$emit('synchronizeCalendar', response.result.items)
      } catch (err) {
        console.log(err.message)
        return;
      }
    },

    // synchronize

    confirmSynchronizeCalendar() {
      ElMessageBox.confirm(
        'Thời khoá biểu sẽ được cập nhật vào Google Calendar của bạn. Tiếp tục?',
        'Warning',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      )
        .then(() => {
          gapi.client.load('calendar', 'V3', this.addEventToGoogleCalendar.bind(this));
          this.synchronizeWithGoogleCalendar();
          ElMessage({
            message: "Đồng bộ hoá thành công",
            type: 'success',
          });
        })
        .catch((e) => {
          ElMessage({
            message: e.message,
            type: 'error',
          });
        })
    },

    addEventToGoogleCalendar() {
      console.log(this.events)
      this.events.forEach((appEvent) => {
        let event = convertEventToGoogleCalendar(appEvent.start, appEvent.end, appEvent.title, appEvent.content, this.remindTime);
        const request = gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': event
        })

        request.execute(function (event) {
          console.log('Event created: ' + event.htmlLink);
        });
      });
    },

    synchronizeWithGoogleCalendar() {
      axios.post(import.meta.env.VITE_API + '/timetable/synchronize', getHeaderConfig())
        .catch(e => {
          console.error(e.message);
        });
    },

    // update to google and remind time
    async getRemindTime() {
      var timetable = (await axios.get(import.meta.env.VITE_API + '/timetable', getHeaderConfig())).data;
      return timetable.remindTime;
    },

    updateRemindTime() {
      axios.post(import.meta.env.VITE_API + '/timetable/remind/' + this.remindTime, getHeaderConfig())
        .then(() => {
          ElMessage({
            type: 'success',
            message: 'Cập nhật thành công',
          })
        })
        .catch(e => {
          ElMessage({
            type: 'error',
            message: e.message,
          })
        });
      this.dialogRemindVisible = false;
    },

    turnOffRemindTime() {
      axios.post(import.meta.env.VITE_API + '/timetable/remind/-1', getHeaderConfig())
        .then(() => {
          ElMessage({
            type: 'success',
            message: 'Cập nhật thành công',
          })
        })
        .catch(e => {
          ElMessage({
            type: 'error',
            message: e.message,
          })
        });
      this.dialogRemindVisible = false;
      this.remindTime = undefined;
    },

    // delete timetable
    deleteTimetable() {
      ElMessageBox.confirm(
        'Thời khoá biểu của bạn sẽ bị xoá vĩnh viễn. Tiếp tục?',
        'Warning',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      ).then(() => {
        axios.delete(import.meta.env.VITE_API + '/timetable', getHeaderConfig())
          .then(() => {
            ElMessage({
              type: 'success',
              message: 'Delete completed',
            })
          })
          .catch(e => {
            ElMessage({
              type: 'error',
              message: e.message,
            });
          })
      })
    }
  }
}
</script>

<style scoped></style>