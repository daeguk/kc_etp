<template>
  <v-dialog v-model="dialog" persistent content-class="progressbar_w">
    <template>
      <v-progress-circular :size="50" indeterminate></v-progress-circular>
    </template>
  </v-dialog>
</template>

<script>
export default {
  props: [],
  data() {
    return {
      dialog: false
    };
  },
  components: {
  },
  computed: {},
  created: function() {},
  beforeDestroy() {},
  mounted: function() {},
  methods: {
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    }
  }
};
</script>