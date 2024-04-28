<template>
    <section class="vh-100">
        <div class="container-fluid h-custom">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-md-9 col-lg-6 col-xl-5">
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                        class="img-fluid" alt="Sample image">
                </div>
                <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                    <form>
                        <div class="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                            <p class="lead fw-normal mb-0 me-1">Register with</p>
                            <button type="button" data-mdb-button-init data-mdb-ripple-init
                                class="btn btn-outline-danger btn-floating mx-1" @click="handleAuthClick">
                                <i class="bi bi-google"></i> Google
                            </button>
                        </div>
                        <div class="divider d-flex align-items-center my-4">
                            <h3 class="text-center fw-bold mx-3 mb-0">Register</h3>
                        </div>

                        <div data-mdb-input-init class="form-outline mb-4">
                            <label class="form-label" for="form3Example3">Username<i class="text-danger">*</i></label>
                            <input type="text" v-model="username" id="form3Example3" class="form-control"
                                placeholder="Enter username" />
                        </div>

                        <div data-mdb-input-init class="form-outline mb-3">
                            <label class="form-label" for="form3Example4">Password<i class="text-danger">*</i></label>
                            <input type="password" v-model="password" id="form3Example4" class="form-control"
                                placeholder="Enter password" />
                        </div>

                        <div data-mdb-input-init class="form-outline mb-4">
                            <label class="form-label" for="form3Example3">Name<i class="text-danger">*</i></label>
                            <input type="text" v-model="name" id="form3Example3" class="form-control"
                                placeholder="Enter phone" />
                        </div>

                        <div data-mdb-input-init class="form-outline mb-4">
                            <label class="form-label" for="form3Example3">Email<i class="text-danger">*</i></label>
                            <input type="email" v-model="email" id="form3Example3" class="form-control"
                                placeholder="Enter email" />
                        </div>

                        <div data-mdb-input-init class="form-outline mb-4">
                            <label class="form-label" for="form3Example3">Phone<i class="text-danger">*</i></label>
                            <input type="text" v-model="phone" id="form3Example3" class="form-control"
                                placeholder="Enter phone" />
                        </div>

                        <div data-mdb-input-init class="form-outline mb-4">
                            <label class="form-label" for="form3Example3">Group key</label>
                            <input type="text" v-model="groupId" id="form3Example3" class="form-control"
                                placeholder="Enter key of group" />
                            <small class="text-muted"><i>If you don't have any group key, a new group with be
                                    created</i></small>
                        </div>
                        <div class="text-center text-lg-start mt-4 pt-2">
                            <button type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-primary"
                                style="padding-left: 2.5rem; padding-right: 2.5rem;" @click="register">Register</button>
                            <p class="small fw-bold mt-2 pt-1 mb-0">Have an account? <a href="/login"
                                    class="link-danger link-underline-opacity-0">Login</a></p>
                        </div>

                    </form>
                </div>
            </div>
        </div>
        <div
            class="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
            <!-- Copyright -->
            <div class="text-white mb-3 mb-md-0">
                Copyright © 2024. All rights reserved.
            </div>
            <!-- Copyright -->
        </div>
    </section>
</template>
<script>
import axios from 'axios'
import router from '../router/index.ts';

export default {
    data() {
        return {
            username: null,
            password: null,
            name: null,
            email: null,
            phone: null,
            groupId: null,

            tokenClient: null,
            gis: undefined,
            API_KEY: 'AIzaSyBPShQcWXAEbDr_4MmlDGvO5ISCIFL-cLM',
            CLIENT_ID: '925112903740-3ecuv4hd59pnshb94ce6vavs5q6tb9pf.apps.googleusercontent.com',
            DISCOVERY_DOC: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
            SCOPES: 'https://www.googleapis.com/auth/calendar',
        }
    },
    mounted() {
        var token = localStorage.getItem(import.meta.env.VITE_TOKEN_NAME);
        if (token != null && token != '') {
            router.push('/group');
            return;
        }
        this.gapiLoaded();
        this.gisLoaded();
    },
    methods: {
        async register() {
            var res = (await axios.post(import.meta.env.VITE_API + '/register', {
                username: this.username,
                password: this.password,
                name: this.name,
                email: this.email,
                phone: this.phone,
                groupId: this.groupId,
            })).data;
            if (res.Success) {
                router.push('/login');
            }
        },
        handleAuthClick() {
            this.tokenClient.callback = async (resp) => {
                if (resp.error !== undefined) {
                    throw (resp);
                }
                await this.listUpcomingEvents();
            };

            if (gapi.client.getToken() === null) {
                this.tokenClient.requestAccessToken({ prompt: 'consent' });
            } else {
                this.tokenClient.requestAccessToken({ prompt: '' });
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
                console.log(response)
            } catch (err) {
                console.log(err.message)
                return;
            }
        },
        gapiLoaded() {
            gapi.load('client', this.initializeGapiClient);
        },

        /**
         * Callback after the API client is loaded. Loads the
         * discovery doc to initialize the API.
         */
        async initializeGapiClient() {
            await gapi.client.init({
                apiKey: this.API_KEY,
                discoveryDocs: [this.DISCOVERY_DOC],
            });
        },

        /**
         * Callback after Google Identity Services are loaded.
         */
        gisLoaded() {
            this.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: this.CLIENT_ID,
                scope: this.SCOPES,
                callback: 'http://localhost:5173', // defined later
            });
        }
    },
}
</script>

<style scoped>
.divider:after,
.divider:before {
    content: "";
    flex: 1;
    height: 1px;
    background: #eee;
}

.h-custom {
    height: calc(100% - 73px);
}

@media (max-width: 450px) {
    .h-custom {
        height: 100%;
    }
}
</style>
