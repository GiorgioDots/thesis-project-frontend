<template>
  <div>
    <Header></Header>
    <nuxt />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
export default {
  components:{
    Header
  },
  created(){
    this.storeToken();
  },
  methods:{
    storeToken(){
      this.$store.dispatch('initToken')
    }
  }
}
</script>

<style>
html {
  font-family: 'Raleway', sans-serif;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  background-image: url('https://www.maxizoo.it/blog/wp-content/uploads/2017/11/Cosa-dare-da-mangiare-a-un-gattino.jpg');
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;

}
</style>
