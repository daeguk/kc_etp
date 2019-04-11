<template>
  <v-container fluid grid-list-md pa-0 mb-4>
  <v-layout row wrap>
    <v-flex md6> 
      <!--table1--->
      <div class="indexinfo_box01 ver1">
  <h4 class="mb-0">지수정보 구독 현황</h4>
  <v-data-table 
    :headers="headers"
    :items="subscribe_results"
    slot="extension"
    hide-actions
  >
    <template slot="items" slot-scope="props">
      <td class="text-xs-left">{{ props.item.INST_NAME }}</td>
      <td class="text-xs-right">15</td>
      <td class="text-xs-center"><v-btn depressed dark small color="#ff821d" @click.stop="dialogOpen('3', props.item);">해지</v-btn></td>
    </template>
  </v-data-table>

  </div>
      <!--table1 end-->
    </v-flex>
    <v-flex md6>
      <!--tabel2--->
       <div class="indexinfo_box01 ver1">
        <h4 class="mb-0">지수정보 신청 현황</h4>
        <v-data-table :headers="headers2" :items="req_results" slot="extension" hide-actions>
            <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.INST_NAME }}</td>
                <td class="text-xs-right">{{ props.item.REG_TIME }}</td>
                <td class="text-xs-center">
                    <v-btn depressed dark small color="#42a4e1" @click.stop="dialogOpen('1', props.item);">YES</v-btn>
                    <v-btn depressed dark small color="grey" @click.stop="dialogOpen('2', props.item);">NO</v-btn>
                </td>
            </template> 
        </v-data-table> 
    </div>
      <!---table2--->
    </v-flex>
     <v-flex>
        <v-dialog
            v-model="dialog"
            max-width="450"
        >
        <v-card class="pop_alert">
        <h6><v-icon class="confirm">help</v-icon> Confirm</h6>
        <!--h6><v-icon class="warning_1">warning</v-icon> Warning</h6>
        <h6><v-icon class="error_1">error</v-icon> Error</h6-->
          <v-card-title>정보 공개 요청 {{message}} 하시겠습니까?</v-card-title>
  
         
          <v-card-actions>
            <v-spacer></v-spacer>
  
            <v-btn
              class="pop_alret_yesbtn"
              depressed
              dark
              small
              @click="updateIndexOpenYn('Y');"
            >
              예
            </v-btn>
  
            <v-btn
              class="pop_alret_nobtn"
              depressed
              dark
              small
              @click="updateIndexOpenYn('N');"
            >
              아니요
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
         </v-flex>    
  </v-layout>
  </v-container>
</template>


<script>

import Config from '@/js/config.js';
 export default {
    props: [],
    data() {
        return {
        rowsPerPageItems: [50, 50],
        headers: [
            {text: '기간명', align:"left", value: 'name' },
            {text: '구독지수', align:"right",  value: 'calories'},
            {text: '', align:"center", sortable: false, value: 'button'}
        ],
        message: '승인',
        reqFlag: true,
        dialog: false,
        subscribe_results: [
        ],
        headers2: [
            { text: "신청기관", align: "left", value: "inst_name" },
            { text: "요청일자", align: "right", value: "reg_time" },
            { text: "요청처리", align: "center", sortable: false, value: "button" }
        ],
        req_results: [],
        modalFlag: false,
        };
    },
    computed: {

    },
    created: function() {

    },
    beforeDestroy() {

    },
    mounted: function() {
        this.getInfoOpenReqList();
        this.getindexSubscribeList();
    },
    methods: {
        getInfoOpenReqList: function() {
            console.log("getInfoOpenReqList");
            var vm = this;

            axios.get(Config.base_url + "/user/index/getinfoopenreqlist", {
                    params: {
                        jisu_cd : vm.$route.query.jisu_cd,
                    }
                }).then(response => {
                    // console.log(response);
                    if (response.data.success == false) {
                        alert("해당 신청현황이 없습니다");
                    } else {
                        var items = response.data.results;
                        
                        console.log("response=" + JSON.stringify(items));
                        vm.req_results = items;
                    } 
                });
        }, 
        getindexSubscribeList: function() {
            console.log("getInfoOpenReqList");
            var vm = this;

            axios.get(Config.base_url + "/user/index/getindexSubscribeList", {
                    params: {
                        jisu_cd : vm.$route.query.jisu_cd,
                    }
                }).then(response => {
                    // console.log(response);
                    if (response.data.success == false) {
                        alert("해당 신청현황이 없습니다");
                    } else {
                        var items = response.data.results;
                        
                        console.log("getindexSubscribeList=" + JSON.stringify(items));
                        vm.subscribe_results = items;
                    } 
                });
        }, 
        dialogOpen: function(flag, item) {
            this.selected = item;
            if (flag == '1') {
                this.message = '승인';
                this.reqFlag = true;
            } else if (flag == '2') {
                this.message = '거절';
                this.reqFlag = false; 
            } else {
                this.message = '해지';
                this.reqFlag = false; 
            }
            this.dialog = true;
        },
        updateIndexOpenYn: function(flag) {
            this.dialog = false;

            if(flag == 'Y') {
                console.log("JISU_ID="+this.selected.F16013);
                axios.post(Config.base_url + '/user/index/updateIndexOpenYn', {
                    params : {
                        flag : flag,
                        reqFlag : this.reqFlag,
                        JISU_ID : this.selected.F16013,
                        INST_CD : this.selected.INST_CD
                    }
                }).then(response => {
                  
                    this.getInfoOpenReqList();
                })
            }
        }
    }
  
}
</script>
