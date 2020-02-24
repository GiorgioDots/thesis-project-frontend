<template>
  <div>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="teal lighten-1" dark flat>
              <v-toolbar-title>Raspberry configuration</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" v-model="valid" :lazy-validation="lazy">
                <v-text-field
                  v-model="formData.raspiId"
                  :rules="raspiIdRules"
                  label="Raspi Id"
                  required
                  name="raspiId"
                  type="text"
                />
                <v-select
                  v-model="formData.resolution"
                  :items="resolutionsItems"
                  label="Photos Resolution"
                ></v-select>
                <v-text-field
                  v-model="formData.confidence"
                  :rules="confidenceRules"
                  label="Face Recognition Precision (1 low - 99 very high - reccomended: 50)"
                  required
                  name="confidence"
                  type="number"
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
        raspiId: "",
        confidence: 50,
        resolution: ""
      },
      lazy: false,
      raspiIdRules: [v => !!v || "Raspi ID is required"],
      confidenceRules: [
        v => (v > 0 && v < 100) || "Confidence must be between 0 and 100"
      ],
      snackbar: false,
      sbcolor: "",
      logMessage: "",
      resolutionsItems: [
        "1920x1080",
        "	1600×1200",
        "1680×1050",
        "1400×1050",
        "1440×900",
        "1280×1024",
        "1280×720",
        "640×480"
      ]
    };
  },
  created() {
    let user = this.$store.getters.getUser;
    this.formData.resolution = user.raspiConfig.resolution;
    this.formData.confidence = user.raspiConfig.confidence;
    this.formData.raspiId = user.raspiConfig.raspiId;
  },
  methods: {
    saveChanges() {
      this.$nextTick(() => {
        this.$nuxt.$loading.start();
        let user = this.$store.getters.getUser;
        let data = {
          resolution: this.formData.resolution,
          confidence: this.formData.confidence
        };
        axios
          .put(
            `${process.env.baseUrl}/raspi/config/${this.formData.raspiId}`,
            {
              ...data
            },
            {
              headers: {
                Authorization: `Bearer ${user.token}`
              }
            }
          )
          .then(response => {
            user.raspiConfig = response.data.raspiConfig;
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
      });
    }
  }
};
</script>