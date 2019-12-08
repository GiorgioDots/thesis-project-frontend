<template>
  <div class="container-fluid p-3">
    <div class="col col-md-auto">
      <div class="shadow p-3 mb-5 bg-white rounded">
        <SignUpForm @onSubmit="onSubmit"></SignUpForm>
        <div v-for="message in messages" :key="message.msg">
          <br />
          <b-alert show variant="danger">{{message.msg}}</b-alert>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SignUpForm from "@/components/Auth/SignUpForm.vue";
export default {
  components: {
    SignUpForm
  },
  data() {
    return {
      messages: ""
    };
  },
  methods: {
    onSubmit(form) {
      //   console.log(form);
      this.$store
        .dispatch("onSignup", form)
        .then(data => {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          this.$router.push("/dashboard");
        })
        .catch(error => {
          this.messages = error.data.data;
          setTimeout(() => {
            this.messages = [];
          }, 5000);
        });
    }
  }
};
</script>