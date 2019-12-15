<template>
  <div>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="teal lighten-1" dark flat>
              <v-toolbar-title>Account settings</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" v-model="valid" :lazy-validation="lazy">
                <v-text-field
                  v-model="formData.name"
                  :rules="nameRules"
                  label="Name"
                  required
                  name="name"
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
                <v-text-field
                  v-model="formData.raspiId"
                  :rules="raspiIdRules"
                  label="Raspi ID"
                  required
                  name="raspiId"
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
                @click="saveChanges()"
              >Save changes</v-btn>
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
        telegramId: "",
        raspiId: "",
        name: ""
      },
      lazy: false,
      telegramIdRules: [v => !!v || "Telegram ID is required"],
      nameRules: [v => !!v || "Name is required"],
      raspiIdRules: [v => !!v || "Raspi ID is required"],
      snackbar: false,
      sbcolor: "",
      logMessage: ""
    };
  },
  created() {
    let user = this.$store.getters.getUser;
    this.formData.telegramId = user.telegramId;
    this.formData.name = user.name;
    this.formData.raspiId = user.raspiId;
  },
  methods: {
    saveChanges() {
      this.$nuxt.$loading.start();
      let user = this.$store.getters.getUser;
      axios
        .put(
          `${process.env.baseUrl}/user/${user._id}`,
          {
            ...this.formData
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        )
        .then(response => {
          user.name = this.formData.name;
          user.telegramId = this.formData.telegramId;
          user.raspiId = this.formData.raspiId;
          this.$store.dispatch("setUser", user);
          this.snackbar = true;
          this.logMessage = response.data.message;
          this.sbcolor = "success";
          this.$nuxt.$loading.finish();
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