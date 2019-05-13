<template>
    <v-layout row wrap>
        <v-flex xs12>
            <v-tabs
                slot="extension"
                v-model="tabs"
                align-with-title
                light
            >
            <v-tabs-slider color="#1e99e8"></v-tabs-slider>
    
            <v-tab v-for="item in items" :key="item" v-on:click="moveTab()" >
                {{ item }}
            </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tabs" >
                <v-tab-item>
                    <EtpApplyList @moveUpdatePage="moveUpdatePage" :seq= "seq"></EtpApplyList>
                </v-tab-item>
                <v-tab-item >
                    <EtpResiter @movePage="movePage()" :seq= "seq" ref="form" ></EtpResiter>
                </v-tab-item>
        </v-tabs-items>    
      </v-flex>
    </v-layout> 
</template>

<script>
import EtpApplyList   from  './EtpApplyList.vue'
import EtpResiter   from  './EtpRegister.vue'

export default {
        data() {
            return {
                seq : 0,
                tabs: 0,
                items: ['신청현황', '신규등록']
    	};
    },    
    components: {
        EtpApplyList     : EtpApplyList,
        EtpResiter     : EtpResiter,
    },

    methods: {
       
         moveUpdatePage: function(seq) {  //상세페이지 연결
            var vm = this;
            console.log("moveUpdatePage seq", seq);
           if( vm.$refs.form!==undefined){
                vm.$refs.form.seq = seq;
                vm.$refs.form.getEtpRegisterView();
                vm.tabs = 1;
           }
           
            
         },

         movePage: function() { //조회페이지 연결

            var vm = this;
            vm.tabs = 0;
         },

         moveTab : function(){ //탭이동
            var vm = this;
            console.log("moveTab", vm.tabs);
                if(vm.tabs ==0){
                    if( vm.$refs.form!==undefined){
                    vm.$refs.form.seq = 0;
                    vm.$refs.form.e1 = 1;
                    vm.$refs.form.getEtpRegisterView();
                    }
                }
        }

    },
  

}
</script>

<style scoped>

</style>