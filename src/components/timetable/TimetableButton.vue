<template>
  <div>
    <div>
      <div class="justify-content-end d-flex">
        <button type="button" class="btn btn-blue" data-bs-toggle="modal" data-bs-target="#importModal"
          @click="this.importAlert = ''">Import</button>
        <button type="button" class="btn btn-pink" @click="synchronizeWithGoogleCalendar">Synchonize</button>
        <button type="button" class="btn btn-blue" @click="updateAndRemind">Remind</button>
        <button type="button" class="btn btn-red">Remove</button>
      </div>
      <div class="d-flex justify-content-end">
        <i class="text-muted"><small>Đồng bộ sẽ chỉ 1 chiều. Nếu abc đồng bộ 2.</small></i>
      </div>
      <!-- Modal -->
      <div class="modal fade" id="importModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Import timetable</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
              </button>
            </div>
            <div class="modal-body text-center py-4">
              <IconImport @click="$refs.file.click()" />
              <h3>Select a file to import</h3>
              <p>Using file export from qldt.utc.edu.vn or download template import <a>here</a></p>
              <p class="text-danger" v-show="importAlert == '' ? false : true">{{ importAlert }}</p>
              <div>
                <input type="file" ref="file" @change="handleFileChange($event)" accept="image/*" capture hidden />
                <button type="button" class="btn btn-modal btn-blue" @click="$refs.file.click()">
                  <IconButtonImport /> Import
                </button>
                <button type="button" class="btn btn-modal btn-dismiss" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
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


export default {
  components: {
    IconImport,
    IconButtonImport
  },
  data() {
    return {
      fileUpload: undefined,
      importAlert: '',
      ggGapiHandler: undefined
    }
  },
  mounted() {
    this.ggGapiHandler = new GoogleGapiHandler();
  },
  methods: {

    // import timetable

    async importTimetable() {
      var formData = new FormData();
      formData.append('image', this.fileUpload);
      var res = (await axios.post(import.meta.env.VITE_API + '/import/timetable', {
        file: this.fileUpload
      }, getHeaderConfig('multipart/form-data'))).data;
      this.importAlert = 'Import success';
      this.$emit('refreshCalendar');
    },

    handleFileChange(event) {
      this.fileUpload = event.target.files[0];
      if (this.fileUpload) {
        this.importTimetable();
      }
      else {
        console.log("error")
      }
    },

// synchronize with google

    synchronizeWithGoogleCalendar() {
      this.handleAuthClick();
    },
    showSynchronizeAlert() {
      //this.$swal('Hello Vue world!!!');
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

    // update to google and remind time
    updateAndRemind(){
      
    }
  }
}
</script>

<style scoped>
.btn {
  margin: .5rem 0 .5rem .5rem;
}

.btn-pink {
  background: var(--Pink);
  color: var(--White);
}

.btn-red {
  background: var(--Red);
  color: var(--White);
}

.btn-blue {
  color: var(--White);
  background: var(--SkyBlue);
}

.btn-dismiss {
  color: var(--DarkGray);
  background: var(--White);
  border: .5px solid var(--Gray);
}

.btn-modal {
  padding: .375rem 2rem;

}
</style>