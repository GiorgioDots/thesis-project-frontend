<template>
  <div>
    <v-list v-if="!isAuth">
      <v-list-item link to="/login" @click="$emit('changePage')">
        <v-list-item-content>Login</v-list-item-content>
      </v-list-item>
      <v-list-item link to="/signup" @click="$emit('changePage')">
        <v-list-item-content>Signup</v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list v-else>
      <v-list-item link to="/dashboard" @click="$emit('changePage')">
        <v-list-item-content>Dashboard</v-list-item-content>
      </v-list-item>
      <v-list-item link to="/people" @click="$emit('changePage')">
        <v-list-item-content>People</v-list-item-content>
      </v-list-item>
      <v-list-item link to="/settings" @click="$emit('changePage')">
        <v-list-item-content>Settings</v-list-item-content>
      </v-list-item>
      <v-list-item link to="/history" @click="$emit('changePage')">
        <v-list-item-content>History</v-list-item-content>
      </v-list-item>
      <v-list-item link to="/" @click="onLogout">
        <v-list-item-content>Logout</v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  props: ["isAuth"],
  methods: {
    onLogout() {
      this.$nuxt.$loading.start();
      this.$emit("changePage");
      localStorage.removeItem("user");
      this.$store.dispatch("logoutUser");
      this.$nuxt.$loading.finish();
    }
  }
};
</script>