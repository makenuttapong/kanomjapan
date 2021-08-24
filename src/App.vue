<template>
  <div id="app">
    <router-view  />
    <scrollTop />
  </div>
</template>

<script>
import scrollTop from "./components/scrollTotop.vue";
export default {
  name: "App",
  components: {
    scrollTop,
  },
  methods: {
    // scrollToTop() {
    //   window.scrollTo(0, 0);
    // },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Mitr:wght@400&display=swap");

#app {
  font-family: "Mitr", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
html,
body {
  height: 100%;
  background-color: #f8f8f8 !important;
}
</style>
