<template>
  <div>
    <v-btn
      class="mb-10"
      fab
      dark
      bottom
      left
      fixed
      color="pink darken-1"
      @click="addPersonOverlay = true;"
    >
      <v-icon>fas fa-trash-alt</v-icon>
    </v-btn>
    <v-container fluid>
      <v-expansion-panels accordion multiple focusable>
        <v-expansion-panel v-for="event in events" :key="event.id">
          <v-expansion-panel-header>At: {{event.date | date}} - Who: {{event.person.name}} - Degree: {{event.person.degree}}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <p>Description: {{event.description}}</p>
            <v-btn color="error" small outlined>
              <v-icon small>fas fa-trash-alt</v-icon>
            </v-btn>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </div>
</template>
<script>
export default {
  // computed: {
  //   events() {
  //     let user = this.$store.getters.getUser;
  //     return user.events;
  //   }
  // }
  data() {
    return {
      events: [
        {
          id: "1",
          person: {
            _id: "5df63ff42197474660cccf79",
            name: "Giorgio Dodesini",
            degree: "io",
            imageUrl:
              "https://peopleimages-thesis.s3.eu-west-1.amazonaws.com/9ff4cfbc-8519-4cfa-b330-37c0d456a6cd.jpg",
            user: "5df53f4527352a4388d3369f",
            imageName: "9ff4cfbc-8519-4cfa-b330-37c0d456a6cd.jpg",
            faceId: "5d5c0f5b-3f24-41a0-af30-fbce5d34360a",
            __v: 0
          },
          description: "Test",
          date: new Date().toISOString()
        },
        {
          id: "1",
          person: {
            _id: "5df65f766f6eb916b017abc1",
            name: "Giorgio Dodesini",
            degree: "Burro",
            imageUrl:
              "https://peopleimages-thesis.s3.eu-west-1.amazonaws.com/31d0577e-3a9a-4f60-a66f-61d0c8f66d35.jpg",
            user: "5df53f4527352a4388d3369f",
            imageName: "31d0577e-3a9a-4f60-a66f-61d0c8f66d35.jpg",
            faceId: "613b2a02-9763-45b9-96ed-704e05bf3070",
            __v: 0
          },
          description: "Test",
          date: new Date().toISOString()
        }
      ]
    };
  }
};
</script>