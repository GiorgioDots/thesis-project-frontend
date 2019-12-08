<template>
  <div>
    <Header></Header>
    <nuxt />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
export default {
  components: {
    Header
  },
  created() {
    this.initUser();
  },
  methods: {
    initUser() {
      this.$store.dispatch("setToken", localStorage.getItem("token"));
      this.$store.dispatch("setUserId", localStorage.getItem("userId"));
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
</style>
