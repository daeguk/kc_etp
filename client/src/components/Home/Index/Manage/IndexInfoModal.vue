<template>
  <v-dialog v-model="modal" full-width>
    <v-card>
      <v-card-title class="headline">Use Google's location service?</v-card-title>

      <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" flat="flat" @click="closeModal()">Agree</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import Config from "@/js/config.js"
  export default {
    props: ['modalFlag'],
    data() {
      return {
        modal: false,
      };
    },
    mounted: function() {
      console.log("indexinfomodal......");
      this.modal = this.modalFlag;
      // this.getInfoOpenReqList();
    },
    created: function() {},
    beforeDestroy() {},
    methods: {
      closeModal: function() {
        this.modal = false;
        this.$EventBus.$emit("closeIndexInfoModal");
      }
      // getInfoOpenReqList: function() {
      //   console.log('getInfoOpenReqList');
      //   var vm = this;
      //   axios.get(Config.base_url+'/user/index/getinfoopenreqlist', {
      //       params: {
      //           // "bbs_id" : vm.bbs_id,
      //           // "seloption" : vm.seloption,
      //           // "searchinfo" : vm.searchinfo,
      //           // "curPage": vm.curPage,
      //           // "perPage": vm.perPage
      //       }
      //   }).then(function(response) {
      //       // console.log(response);
      //       if(response.data.success == false){
      //           alert("해당 신청현황이 없습니다");
      //       }else {
      //         var items = response.data.results;
      //         var tcount   = response.data.count;
      //         vm.results = items;
      //         vm.count = tcount;
      //       }
      //   });
      // },
    }
  }
</script>
<style scoped>
</style>