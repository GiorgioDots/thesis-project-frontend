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
          <template v-if="mostDetectedUser > 0">
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
                          <v-btn class="mx-2" small outlined to="/history">
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
    <v-row align="start" justify="center"></v-row>
  </v-container>
</template>
<script>
export default {
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
    }
  }
};
</script>