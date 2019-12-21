<template>
  <v-container fluid v-if="user">
    <v-row align="start" justify="center">
      <v-col lg="4" md="6">
        <v-card min-width="200">
          <v-card-title>Last Person Detected</v-card-title>
          <template v-if="user.events.length != 0">
            <v-card-subtitle>Name: {{lastPersonDetected.name}} - Degree: {{lastPersonDetected.degree}} - Detected At: {{user.events[0].date | date}}</v-card-subtitle>
            <v-img :src="user.events[0].imageUrl" max-height="200px"></v-img>
          </template>
        </v-card>
      </v-col>
      <v-col lg="4" md="6">
        <v-card min-width="200">
          <v-card-title>Most Detected Person</v-card-title>
          <template v-if="mostDetectedUser">
            <v-card-subtitle>Name: {{mostDetectedUser.name}} - Degree: {{mostDetectedUser.degree}} - Counter: {{mostDetectedUser.counter}}</v-card-subtitle>
            <v-img :src="mostDetectedUser.imageUrl" height="200"></v-img>
          </template>
        </v-card>
      </v-col>
      <v-col lg="4" md="6">
        <v-card min-width="200">
            <v-card-title>Last Events (max 3)</v-card-title>
            <template v-if="user.events.length != 0">
              <v-container fluid>
                <v-expansion-panels accordion multiple focusable popout>
                  <v-expansion-panel v-for="(event) in user.events.slice(0,3)" :key="event._id">
                    <v-expansion-panel-header>{{event.description}}</v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-container fluid>
                        <v-row justify="end">
                          <v-btn small outlined @click="goToEventDetails(event)">
                            <v-icon small>mdi-open-in-new</v-icon>
                          </v-btn>
                        </v-row>
                      </v-container>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-container>
          </template>
        </v-card>
      </v-col>
    </v-row>
    <v-overlay :value="eventOverlay">
        <v-container fluid>
          <v-row align="center" justify="center">
            <v-col lg="12" md="12" sm="12">
              <v-card class="elevation-12" min-width="200" max-width="300">
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
                <v-card-actions>
                  <v-spacer></v-spacer>
                    <v-btn icon :href="openedEvent.imageUrl" class="mb-0">
                      <v-icon>fas fa-download</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-overlay>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      openedEvent: {},
      eventOverlay: false
    }
  },
  computed: {
    user() {
      let user = this.$store.getters.getUser;
      user.events.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      return user;
    },
    mostDetectedUser() {
      return this.findMostDetectedUser(this.user.people);
    },
    lastPersonDetected() {
      for (let person of this.user.people) {
        if (person._id == this.user.events[0].person) {
          return person;
        }
      }
    }
  },
  methods: {
    findMostDetectedUser(people) {
      let max = -1;
      let maxPerson = null;
      for (let person of people) {
        if (person.doCount) {
          if (person.counter > max) {
            max = person.counter;
            maxPerson = person;
          }
        }
      }
      return maxPerson;
    },
    goToEventDetails(event) {
      this.openedEvent = event;
      this.eventOverlay = true;
    },
    closeEventDetails() {
      this.openedEvent = {};
      this.eventOverlay = false;
    }
  }
};
</script>