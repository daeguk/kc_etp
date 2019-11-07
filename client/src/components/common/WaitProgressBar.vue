<template>
<v-dialog v-model="dialog" persistent content-class="progressbar_w1">     
  <template>
      <v-card flat class="progress_1">
   <v-row
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <v-col
          class="subtitle-1 text-center"
          cols="6"
        >
        <v-flex class="pogress_1icon">
            <v-icon>error</v-icon>
        </v-flex>
        <v-flex>
            Please wait a minute<br>잠시만 기다려주세요
        </v-flex>
        </v-col>
        <v-col cols="10">
          <v-progress-linear
            color="#1e99e8"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
        </v-col>
      </v-row>
      </v-card>
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