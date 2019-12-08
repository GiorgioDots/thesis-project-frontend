<template>
  <div class="container-fluid p-3">
    <div class="col col-md-auto">
      <div class="shadow p-3 mb-5 bg-white rounded">
        <LoginForm @onSubmit="onSubmit"></LoginForm>
        <br />
        <b-alert show variant="danger" v-if="message">{{message}}</b-alert>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from "@/components/Auth/LoginForm.vue";
export default {
  components: {
    LoginForm
  },
  data() {
    return {
      message: ""
    };
  },
  methods: {
    onSubmit(form) {
      this.$store
        .dispatch("onLogin", form)
        .then(data => {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          this.$router.push("/dashboard");
        })
        .catch(error => {
          this.message = error.data.message;
          setTimeout(() => {
            this.message = "";
          }, 5000);
        });
    }
  }
};
</script>