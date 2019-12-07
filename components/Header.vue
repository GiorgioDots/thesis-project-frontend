<template>
<div>
    <b-navbar type="light" variant="light">
      <b-navbar-nav>
        <b-navbar-brand to="/">
          <img src="@/assets/logo/logo_transparent.png" width="30" height="30" class="d-inline-block align-top" alt="RaspiFace">
          RaspiFace
        </b-navbar-brand>
      </b-navbar-nav>
      <template v-if="isAuth">
        <b-navbar-nav>
            <b-nav-item to="/dashboard" exact-active-class="active">Dashboard</b-nav-item>
            <b-nav-item to="/configuration" exact-active-class="active">Configuration</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
            <b-nav-item @click="onLogout" exact-active-class="active">Logout</b-nav-item>
        </b-navbar-nav>
      </template>
      <b-navbar-nav v-else>
          <b-nav-item to="/login" exact-active-class="active">Login</b-nav-item>
          <b-nav-item to="/signup" exact-active-class="active">Signup</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
</div>
</template>

<script>
export default {
  computed: {
    isAuth(){
      return this.$store.getters.getToken? true : false;
    }
  },
  methods:{
    onLogout(){
      this.$store.dispatch('onLogout')
      .then(() => this.$router.push('/'));
    }
  }
}
</script>
