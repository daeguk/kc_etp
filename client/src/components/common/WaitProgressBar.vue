<template>
<v-dialog v-model="dialog" persistent content-class="progressbar_w1">     
  <template>
      <v-card flat class="progress_1">
   <v-layout
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <v-flex class="subtitle-1 text-center">
        <v-card flat>
            <v-flex class="pogress_1icon">
                <v-icon>error</v-icon>
             </v-flex>
        <v-flex v-html="title"></v-flex>
        </v-card>
        </v-flex>
      </v-layout>
      <v-card flat>
          <v-progress-linear
            color="#1e99e8"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
    
      </v-card>
      </v-card>
  </template>
</v-dialog>
</template>
<script>
export default {
  props: [],
  data() {
    return {
      dialog: false,
      title: 'Please wait a minute<br>잠시만 기다려주세요'
    };
  },
  components: {
  },
  computed: {},
  created: function() {},
  beforeDestroy() {},
  mounted: function() {},
  methods: {
    open(obj) 
    {
      if (obj.title) {
        this.title = obj.title;
      }
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    }
  }
};
</script>