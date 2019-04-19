<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
    }
  },
  methods: {
  },
  created() {
    // this.$router.push({ path: '/landing'});
  }
}
</script>

<style>
</style>