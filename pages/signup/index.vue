<template>
  <div>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="teal lighten-1" dark flat>
              <v-toolbar-title>Sign Up</v-toolbar-title>
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
                <v-text-field
                  v-model="formData.name"
                  :rules="nameRules"
                  label="Name"
                  required
                  name="name"
                  type="text"
                />
                <v-text-field
                  v-model="formData.raspiId"
                  :rules="raspiIdRules"
                  label="Raspi Id"
                  required
                  name="raspiId"
                  type="text"
                />
                <v-text-field
                  v-model="formData.telegramId"
                  :rules="telegramIdRules"
                  label="Telegram ID"
                  required
                  name="telegramId"
                  type="text"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                :disabled="!valid"
                color="teal lighten-2"
                :dark="valid"
                @click="onSignUp()"
              >Sign Up</v-btn>
              <v-btn color="teal lighten-2" text to="/login">Or Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
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
      formData: {
        name: "",
        email: "",
        password: "",
        raspiId: "",
        telegramId: ""
      },
      snackbar: false,
      sbcolor: "",
      logMessage: "",
      lazy: false,
      nameRules: [v => !!v || "Name is required"],
      passwordRules: [v => !!v || "Password is required"],
      raspiIdRules: [v => !!v || "Raspi ID is required"],
      telegramIdRules: [v => !!v || "Telegram ID is required"],
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ]
    };
  },
  methods: {
    onSignUp() {
      axios
        .put(`${process.env.baseUrl}/auth/signup`, { ...this.formData })
        .then(response => {
          const user = response.data.user;
          user.token = response.data.token;
          this.$store.dispatch("setUser", user);
          this.$router.push("/dashboard");
        })
        .catch(error => {
          this.snackbar = true;
          this.logMessage = error.response.data.message;
          this.sbcolor = "error";
        });
    }
  }
};
</script>