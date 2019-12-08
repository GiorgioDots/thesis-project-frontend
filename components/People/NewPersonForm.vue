<template>
  <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
    <b-form-group id="name" label="Enter name:" label-for="name">
      <b-form-input id="name" v-model="form.name" type="text" required placeholder="Enter name"></b-form-input>
    </b-form-group>

    <b-form-group id="degree" label="Enter person degree:" label-for="degree">
      <b-form-input
        id="degree"
        v-model="form.degree"
        type="text"
        required
        placeholder="Enter degree"
      ></b-form-input>
    </b-form-group>

    <b-form-group id="photo" label="Enter photo:" label-for="photo">
      <b-form-input id="photo" v-model="form.photo" type="text" required placeholder="Enter photo"></b-form-input>
    </b-form-group>

    <b-button type="submit">Submit</b-button>
    <b-button type="reset" variant="link">Reset</b-button>
  </b-form>
</template>

<script>
export default {
  name: "NewPersonForm",
  data() {
    return {
      form: {
        photo: "",
        name: "",
        degree: ""
      }
    };
  },
  methods: {
    onSubmit(evt) {
      // evt.preventDefault();
      this.$emit("onSubmit", this.form);
    },
    onReset(evt) {
      // evt.preventDefault()
      // Reset our form values
      this.form.name = "";
      this.form.photo = "";
      this.form.degree = "";
    }
  }
};
</script>