<template>
  <div>
    <v-btn class="mb-10" fab dark bottom left fixed color="pink darken-1" @click="deleteEvents()">
      <v-icon>fas fa-trash-alt</v-icon>
    </v-btn>
    <v-btn class="mb-10" fab dark bottom right fixed color="pink darken-1" @click="getEvents">
      <v-icon>fas fa-sync</v-icon>
    </v-btn>
    <v-container fluid>
      <v-expansion-panels accordion multiple focusable popout>
        <v-expansion-panel v-for="(event, index) in events" :key="event._id">
          <v-expansion-panel-header>At: {{event.date | date}}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-container fluid>
              <v-row justify="end">
                <v-btn class="mx-2" small outlined @click="goToEventDetails(event)">
                  <v-icon small>mdi-open-in-new</v-icon>
                </v-btn>
                <v-btn color="error" small outlined @click="deleteEvent(index)">
                  <v-icon small>fas fa-trash-alt</v-icon>
                </v-btn>
              </v-row>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <!--EVENT DETAIL OVERLAY-->
      <v-overlay :value="eventOverlay">
        <v-container fluid>
          <v-row align="center" justify="center">
            <v-col lg="12" md="12" sm="12">
              <v-card class="elevation-12" max-width="300">
                <v-toolbar color="teal lighten-1" dark flat>
                  <v-toolbar-title>Event Details</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="closeEventDetails">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-subtitle>Details:</v-card-subtitle>
                <v-card-text>
                  <ul>
                    <li>
                      <b>Detected At</b>
                      : {{openedEvent.date | date}}
                    </li>
                    <li>
                      <b>Description</b>
                      : {{openedEvent.description}}
                    </li>
                  </ul>
                  <v-img :src="openedEvent.imageUrl" max-height="300px"></v-img>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-overlay>
      <!--END EVENT DETAIL OVERLAY-->
      <v-snackbar v-model="snackbar" :color="sbcolor" right :timeout="3000" top>
        {{logMessage}}
        <v-btn dark text @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </v-container>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      events: [],
      snackbar: false,
      sbcolor: "",
      logMessage: "",
      openedEvent: {},
      eventOverlay: false
    };
  },
  methods: {
    deleteEvent(index) {
      this.$nuxt.$loading.start();
      let user = this.$store.getters.getUser;
      axios
        .delete(`${process.env.baseUrl}/events/${this.events[index]._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
        .then(result => {
          this.snackbar = true;
          this.sbcolor = "success";
          this.logMessage = result.data.message;
          this.events.splice(index, 1);
          user.events = this.events;
          this.$store.dispatch("setUser", user);
          this.$nuxt.$loading.finish();
        })
        .catch(error => {
          console.log(error);
          // this.snackbar = true;
          // this.logMessage = error.response.data.message;
          // this.sbcolor = "error";
          this.$nuxt.$loading.finish();
        });
    },
    getEvents() {
      const user = this.$store.getters.getUser;
      axios
        .get(`${process.env.baseUrl}/events/user/${user._id}`, {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`
          }
        })
        .then(response => {
          response.data.events.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
          });
          let user = this.$store.getters.getUser;
          user.events = response.data.events;
          this.events = user.events;
          this.$store.dispatch("setUser", user);
        });
    },
    deleteEvents() {
      this.$nuxt.$loading.start();
      let user = this.$store.getters.getUser;
      axios
        .delete(`${process.env.baseUrl}/events/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
        .then(result => {
          this.snackbar = true;
          this.sbcolor = "success";
          this.logMessage = result.data.message;
          this.events = result.data.events;
          user.events = this.events;
          this.$store.dispatch("setUser", user);
          this.$nuxt.$loading.finish();
        })
        .catch(error => {
          console.log(error);
          this.snackbar = true;
          this.logMessage = error.response.data.message;
          this.sbcolor = "error";
          this.$nuxt.$loading.finish();
        });
    },
    goToEventDetails(event) {
      this.openedEvent = event;
      this.eventOverlay = true;
    },
    closeEventDetails() {
      this.openedEvent = {};
      this.eventOverlay = false;
    }
  },
  created() {
    this.getEvents();
  }
};
</script>