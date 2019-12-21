<template>
  <div>
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="teal lighten-1" dark flat>
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" v-model="valid" :lazy-validation="lazy">
                <v-text-field
                  v-model="formData.email"
                  :rules="emailRules"
                  required
                  label="Email"
                  name="email"
                  type="email"
                />
                <v-text-field
                  v-model="formData.password"
                  :rules="passwordRules"
                  required
                  label="Password"
                  name="password"
                  type="password"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                :disabled="!valid"
                color="teal lighten-2"
                :dark="valid"
                @click="onLogin()"
              >Login</v-btn>
              <v-btn color="teal lighten-2" text to="/signup">Or Signup</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="snackbar" :color="sbcolor" right :timeout="sbtimeout" top>
      {{logMessage}}
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      valid: true,
      formData: {
        email: "",
        password: ""
      },
      snackbar: false,
      sbcolor: "",
      logMessage: "",
      sbtimeout: 3000,
      lazy: false,
      passwordRules: [v => !!v || "Password is required"],
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ]
    };
  },
  methods: {
    onLogin() {
      this.$nextTick(() => {
        this.$nuxt.$loading.start();
        axios
          .post(`${process.env.baseUrl}/auth/login`, { ...this.formData })
          .then(response => {
            let user = response.data.user;
            user.token = response.data.token;
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
              .then(people => {
                user.people = people.data.people;
                axios
                  .get(`${process.env.baseUrl}/events/user/${user._id}`, {
                    headers: {
                      "Content-type": "application/json",
                      Authorization: `Bearer ${user.token}`
                    }
                  })
                  .then(events => {
                    events.data.events.sort(function(a, b) {
                      return new Date(b.date) - new Date(a.date);
                    });
                    user.events = events.data.events;
                    this.$store.dispatch("setUser", user);
                    this.$router.push("/dashboard");
                    this.$nuxt.$loading.finish();
                  })
                  .catch(error => {
                    throw error;
                  });
              })
              .catch(error => {
                throw error;
              });
          })
          .catch(error => {
            this.$nuxt.$loading.finish();
            this.snackbar = true;
            this.logMessage = error.response.data.message;
            this.sbcolor = "error";
          });
      });
    }
  }
};
</script>