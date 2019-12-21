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
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-btn class="mb-10" fab dark bottom right fixed color="pink darken-1" @click="getPeople(false)">
      <v-icon>fas fa-sync</v-icon>
    </v-btn>
    <v-container fluid>
      <v-row>
        <v-col lg="3" md="6" v-for="(person, index) in people" :key="person._id">
          <v-card elevation="5">
            <v-img :src="person.imageUrl" height="130px"></v-img>
            <v-card-title>{{person.name}}</v-card-title>
            <v-card-subtitle>{{person.degree}}</v-card-subtitle>
            <v-card-text>Counter: {{person.counter}}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn dark small color="teal lighten-1" @click="onEditPerson(index)">
                <v-icon small>fas fa-edit</v-icon>
              </v-btn>
              <v-btn dark small color="red darken-2" @click="onDeletePerson(index)">
                <v-icon small>fas fa-trash-alt</v-icon>
              </v-btn>
              <v-btn dark small color="red darken-2" @click="resetCounter(index)" text>
                <span>Reset Counter</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <!--ADD PERSON OVERLAY-->
      <v-overlay :value="addPersonOverlay">
        <v-container>
          <v-row align="center" justify="center">
            <v-col lg="12" md="6">
              <v-card class="elevation-12">
                <v-toolbar color="teal lighten-1" dark flat>
                  <v-toolbar-title>Add Person</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="addPersonOverlay = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  <v-form ref="form" v-model="valid" :lazy-validation="lazy">
                    <v-text-field
                      v-model="formData.name"
                      :rules="nameRules"
                      required
                      label="Person name"
                      name="name"
                      type="text"
                    />
                    <v-text-field
                      v-model="formData.degree"
                      :rules="degreeRules"
                      required
                      label="Degree of kindship"
                      name="degree"
                      type="text"
                    />
                  </v-form>
                  <v-switch v-model="formData.doCount" label="Would count this person?"></v-switch>
                  <v-switch
                    v-model="formData.doNotify"
                    label="Would you be notified whe we saw this person?"
                  ></v-switch>
                  <v-file-input
                    v-model="image"
                    accept="image/png, image/jpeg, image/bmp"
                    placeholder="Select one photo of the person"
                    prepend-icon="mdi-camera"
                    label="Person Image"
                  ></v-file-input>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    :disabled="!valid"
                    color="teal lighten-2"
                    :dark="valid"
                    @click="addPerson()"
                  >Submit</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-overlay>
      <!--END ADD PERSON OVERLAY-->
      <!--EDIT PERSON OVERLAY-->
      <v-overlay :value="editPersonOverlay">
        <v-container>
          <v-row align="center" justify="center">
            <v-col lg="12" md="6">
              <v-card class="elevation-12">
                <v-toolbar color="teal lighten-1" dark flat>
                  <v-toolbar-title>Edit Person</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="closeEditPerson">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  <v-form ref="form" v-model="valid" :lazy-validation="lazy">
                    <v-text-field
                      v-model="formData.name"
                      :rules="nameRules"
                      required
                      label="Person name"
                      name="name"
                      type="text"
                    />
                    <v-text-field
                      v-model="formData.degree"
                      :rules="degreeRules"
                      required
                      label="Degree of kindship"
                      name="degree"
                      type="text"
                    />
                    <v-switch v-model="formData.doCount" label="Would count this person?"></v-switch>
                    <v-switch
                      v-model="formData.doNotify"
                      label="Would you be notified whe we saw this person?"
                    ></v-switch>
                  </v-form>
                  <v-file-input
                    v-model="image"
                    accept="image/png, image/jpeg, image/bmp"
                    placeholder="Select one photo of the person"
                    prepend-icon="mdi-camera"
                    label="Person Image"
                  ></v-file-input>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    :disabled="!valid"
                    color="teal lighten-2"
                    :dark="valid"
                    @click="editPerson()"
                  >Submit</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-overlay>
      <!--END EDIT PERSON OVERLAY-->
      <!--DELETE PERSON OVERLAY-->
      <v-overlay :value="deletePersonOverlay">
        <v-container>
          <v-row align="center" justify="center">
            <v-col lg="12" md="6">
              <v-card class="elevation-12">
                <v-toolbar color="teal lighten-1" dark flat>
                  <v-toolbar-title>Deleting Person</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="closeDeletePerson">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  <v-card-title>Are you sure?</v-card-title>
                  <v-card-subtitle>The operation is irreversible</v-card-subtitle>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn :disabled="!valid" color="error" dark @click="deletePerson()">Ok, delete!</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-overlay>
      <!--END DELETE PERSON OVERLAY-->
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
      valid: true,
      people: [],
      formData: {
        name: "",
        degree: "",
        doCount: false,
        doNotify: true
      },
      editPersonIndex: "",
      deletePersonIndex: "",
      snackbar: false,
      sbcolor: "",
      logMessage: "",
      image: null,
      addPersonOverlay: false,
      editPersonOverlay: false,
      deletePersonOverlay: false,
      lazy: false,
      nameRules: [v => !!v || "Name is required"],
      degreeRules: [v => !!v || "Degree is required"]
    };
  },
  methods: {
    addPerson() {
      this.$nextTick(() => {
        this.$nuxt.$loading.start();
        if(this.image){
          this.valid = false;
          let user = this.$store.getters.getUser;
          let fileData = new FormData();
          fileData.append("image", this.image);
          axios
            .post(
              `${process.env.baseUrl}/people?name=${this.formData.name}&degree=${this.formData.degree}&userId=${user._id}&doCount=${this.formData.doCount}&doNotify=${this.formData.doNotify}`,
              fileData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${user.token}`
                }
              }
            )
            .then(response => {
              this.snackbar = true;
              this.logMessage = response.data.message;
              this.sbcolor = "success";
              this.people.push(response.data.person);
              user.people = this.people;
              this.$store.dispatch("setUser", user);
              this.addPersonOverlay = false;
              this.formData.name = "";
              this.formData.degree = "";
              this.image = null;
              this.$nuxt.$loading.finish();
              this.valid = true;
            })
            .catch(error => {
              this.$nuxt.$loading.finish();
              this.snackbar = true;
              this.logMessage = error.response.data.message;
              this.sbcolor = "error";
              this.valid = true;
            });
        }else{
          this.$nuxt.$loading.finish();
          this.snackbar = true;
          this.logMessage = 'Please select a photo';
          this.sbcolor = "error";
        }
      });
    },
    onEditPerson(index) {
      this.editPersonOverlay = true;
      this.formData.name = this.people[index].name;
      this.formData.degree = this.people[index].degree;
      this.formData.doCount = this.people[index].doCount;
      this.formData.doNotify = this.people[index].doNotify;
      this.editPersonIndex = index;
    },
    closeEditPerson() {
      this.editPersonOverlay = false;
      this.formData.name = "";
      this.formData.degree = "";
      this.formData.doCount = false;
      this.formData.doNotify = true;
      this.editPersonIndex = "";
    },
    editPerson(index) {
      this.valid = false;
      this.$nextTick(() => {
        this.$nuxt.$loading.start();
        let user = this.$store.getters.getUser;
        if (this.image) {
          let fileData = new FormData();
          fileData.append("image", this.image);
          axios
            .put(
              `${process.env.baseUrl}/people/${this.people[this.editPersonIndex]._id}?name=${this.formData.name}&degree=${this.formData.degree}&userId=${user._id}&doNotify=${this.formData.doNotify}&doCount=${this.formData.doCount}`,
              fileData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${user.token}`
                }
              }
            )
            .then(response => {
              this.$nuxt.$loading.finish();
              this.snackbar = true;
              this.logMessage = response.data.message;
              this.sbcolor = "success";
              this.people[this.editPersonIndex] = response.data.person;
              user.people = this.people;
              this.$store.dispatch("setUser", user);
              this.editPersonOverlay = false;
              this.formData.name = "";
              this.formData.degree = "";
              this.image = null;
              this.editPersonIndex = "";
              this.valid = true;
            })
            .catch(error => {
              this.$nuxt.$loading.finish();
              this.snackbar = true;
              this.logMessage = error.response.data.message;
              this.sbcolor = "error";
              this.valid = true;
            });
        } else {
          axios
            .put(
              `${process.env.baseUrl}/people/${this.people[this.editPersonIndex]._id}?name=${this.formData.name}&degree=${this.formData.degree}&userId=${user._id}&doNotify=${this.formData.doNotify}&doCount=${this.formData.doCount}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${user.token}`
                }
              }
            )
            .then(response => {
              this.$nuxt.$loading.finish();
              this.snackbar = true;
              this.logMessage = response.data.message;
              this.sbcolor = "success";
              this.people[this.editPersonIndex] = response.data.person;
              user.people = this.people;
              this.$store.dispatch("setUser", user);
              this.editPersonOverlay = false;
              this.formData.name = "";
              this.formData.degree = "";
              this.image = null;
              this.editPersonIndex = "";
              this.valid = true;
            })
            .catch(error => {
              this.$nuxt.$loading.finish();
              this.snackbar = true;
              this.logMessage = error.response.data.message;
              this.sbcolor = "error";
              this.valid = true;
            });
        }
      });
    },
    onDeletePerson(index) {
      this.deletePersonIndex = index;
      this.deletePersonOverlay = true;
    },
    closeDeletePerson(index) {
      this.deletePersonIndex = "";
      this.deletePersonOverlay = false;
    },
    deletePerson() {
      this.valid = false;
      let user = this.$store.getters.getUser;
      this.$nextTick(() => {
        this.$nuxt.$loading.start();
        axios
          .delete(
            `${process.env.baseUrl}/people/${this.people[this.deletePersonIndex]._id}`,
            {
              params: {
                userId: user._id
              },
              headers: {
                Authorization: `Bearer ${user.token}`
              }
            }
          )
          .then(response => {
            this.snackbar = true;
            this.logMessage = response.data.message;
            this.sbcolor = "success";
            this.people.splice(this.deletePersonIndex);
            user.people = this.people;
            this.$store.dispatch("setUser", user);
            this.deletePersonIndex = "";
            this.deletePersonOverlay = false;
            this.$nuxt.$loading.finish();
            this.valid = true;
          })
          .catch(error => {
            this.snackbar = true;
            this.logMessage = error.response.data.message;
            this.sbcolor = "error";
            this.$nuxt.$loading.finish();
            this.valid = true;
          });
      });
    },
    resetCounter(index) {
      this.$nextTick(() => {
        this.$nuxt.$loading.start();
        let user = this.$store.getters.getUser;
        this.formData.name = this.people[index].name;
        this.formData.degree = this.people[index].degree;
        this.formData.doCount = this.people[index].doCount;
        this.formData.doNotify = this.people[index].doNotify;
        axios
          .put(
            `${process.env.baseUrl}/people/${this.people[index]._id}?name=${this.formData.name}&degree=${this.formData.degree}&userId=${user._id}&doNotify=${this.formData.doNotify}&doCount=${this.formData.doCount}&counter=0`,
            {},
            {
              headers: {
                Authorization: `Bearer ${user.token}`
              }
            }
          )
          .then(response => {
            this.$nuxt.$loading.finish();
            this.snackbar = true;
            this.logMessage = "Couter resetted";
            this.sbcolor = "success";
            this.people[index] = response.data.person;
            user.people = this.people;
            this.$store.dispatch("setUser", user);
            this.editPersonOverlay = false;
            this.formData.name = "";
            this.formData.degree = "";
            this.formData.doCount = false;
            this.formData.doNotify = true;
          })
          .catch(error => {
            this.$nuxt.$loading.finish();
            this.snackbar = true;
            this.logMessage = error.response.data.message;
            this.sbcolor = "error";
          });
      });
    },
    getPeople(isFirst) {
      this.$nextTick(() => {
        this.$nuxt.$loading.start();
        const user = this.$store.getters.getUser;
        axios
          .get(`${process.env.baseUrl}/people`, {
            params: {
              userId: user._id
            },
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`
            }
          })
          .then(response => {
            let user = this.$store.getters.getUser;
            user.people = response.data.people;
            if(!isFirst){
              this.snackbar = true;
              this.logMessage = "People refreshed!";
              this.sbcolor = "success";  
            }
            this.people = user.people;
            this.$store.dispatch("setUser", user);
            this.$nuxt.$loading.finish();
          })
          .catch(error => {
            this.$nuxt.$loading.finish();
            this.snackbar = true;
            this.logMessage = error.response.data.message;
            this.sbcolor = "error";
          });
      });
    }
  },
  created() {
    this.getPeople(true);
  }
};
</script>