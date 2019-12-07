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

          <b-button type="submit">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
      
</template>

<script>
  export default {
    name: 'LoginForm',
    data() {
      return {
        form: {
          email: '',
          password: ''
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
        this.form.password = ''
      }
    }
  }
</script>