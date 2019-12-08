<template>
  <div>
    <b-navbar type="dark" variant="dark">
      <b-navbar-nav>
        <b-navbar-brand to="/">
          <img
            src="@/assets/logo/logo_transparent_inverted.png"
            width="20"
            height="30"
            class="d-inline-block align-top"
            alt="RaspiFace"
          />
          RaspiFace
        </b-navbar-brand>
      </b-navbar-nav>
      <template v-if="isAuth">
        <b-navbar-nav>
          <b-nav-item to="/dashboard" exact-active-class="active">Dashboard</b-nav-item>
          <b-nav-item to="/configuration" exact-active-class="active">Configuration</b-nav-item>
          <b-nav-item to="/people" exact-active-class="active">People</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item @click="onLogout" exact-active-class="active">Logout</b-nav-item>
        </b-navbar-nav>
      </template>
      <b-navbar-nav v-else class="ml-auto">
        <b-nav-item to="/login" exact-active-class="active">Login</b-nav-item>
        <b-nav-item to="/signup" exact-active-class="active">Signup</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
export default {
  computed: {
    isAuth() {
      return this.$store.getters.getToken ? true : false;
    }
  },
  methods: {
    onLogout() {
      this.$store.dispatch("onLogout").then(() => {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        this.$router.push("/");
      });
    }
  }
};
</script>
