<template>
  <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
    <b-form-group
      id="email"
      label="Email address:"
      label-for="email"
      description="We'll never share your email with anyone else."
    >
      <b-form-input
        id="email"
        v-model="form.email"
        type="email"
        required
        placeholder="Enter email"
      ></b-form-input>
    </b-form-group>

    <b-form-group id="password" label="Enter password:" label-for="password">
      <b-form-input
        id="password"
        v-model="form.password"
        type="password"
        required
        placeholder="Enter Password"
      ></b-form-input>
    </b-form-group>

    <b-form-group id="name" label="Your Name:" label-for="name">
      <b-form-input
        id="name"
        v-model="form.name"
        required
        placeholder="Enter name"
      ></b-form-input>
    </b-form-group>

    <b-form-group id="raspiId" label="Raspberry ID:" label-for="raspiId">
      <b-form-input
        id="raspiId"
        v-model="form.raspiId"
        required
        placeholder="Enter raspberry ID"
      ></b-form-input>
    </b-form-group>
    
    <b-form-group id="telegramId" label="Telegram ID:" label-for="telegramId">
      <b-form-input
        id="telegramId"
        v-model="form.telegramId"
        required
        placeholder="Enter telegram ID"
      ></b-form-input>
    </b-form-group>

    <b-button type="submit">Submit</b-button>
    <b-button type="reset" variant="danger">Reset</b-button>
  </b-form>
</template>

<script>
  export default {
    name: 'SignUpForm',
    data() {
      return {
        form: {
          email: '',
          name: '',
          password: '',
          raspiId: '',
          telegramId: ''
        }
      }
    },
    methods: {
      onSubmit(evt) {
        // evt.preventDefault();
        this.$emit('onSubmit', this.form);
      },
      onReset(evt) {
        // evt.preventDefault()
        // Reset our form values
        this.form.email = ''
        this.form.name = ''
        this.form.password = ''
      }
    }
  }
</script>