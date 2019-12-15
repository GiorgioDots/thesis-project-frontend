<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawerState" app>
      <appDrawer :isAuth="isAuth" @changePage="drawerState = false"></appDrawer>
    </v-navigation-drawer>
    <v-app-bar app color="teal darken-1" dark>
      <v-btn icon @click.stop="drawerState = !drawerState">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-toolbar-items>
        <v-btn text to="/">RaspiFace</v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-btn icon href="https://github.com/GiorgioDots" target="_blank">
        <v-icon>mdi-github-circle</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <nuxt />
    </v-content>
    <v-footer color="teal darken-1" app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import Drawer from "@/components/navigation/Drawer.vue";
export default {
  components: {
    appDrawer: Drawer
  },
  data() {
    return {
      logMessage: "",
      snackbar: false,
      sbcolor: "",
      drawerState: false
    };
  },
  beforeCreate() {
    this.$store.dispatch(
      "setUser",
      JSON.parse(localStorage.getItem("RaspiFaceUser"))
    );
  },
  computed: {
    isAuth() {
      return this.$store.getters.getUser;
    }
  }
};
</script>

<style>
html {
  font-family: "Raleway", sans-serif;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}
button:active {
  outline: none;
  border: none;
}
</style>
