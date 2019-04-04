<template>
    <v-container>
        <v-layout justify-center column fill-height>
            <v-flex >
        <v-card>
            <v-card flat>
                <v-card-title primary-title>
                    <div>
                        <h3 class="headline mb-0">정보공개 요청처리</h3>
                        <div
                            style="color:grey"
                        >지수 구성종목의 유동비율, cap비율 및 다양한 factor 비율과 기준시가총액 등 지수의 상세 정보를 요청자와 공유합니다.</div>
                    </div>
                </v-card-title>
            </v-card>
            <v-data-table
                class="table_line1"
                :headers="headers"
                :items="results"
                :rows-per-page-items="rowsPerPageItems"
                disable-initial-sort
            >
                <template slot="items" slot-scope="props">
                    <td class="text-xs-center">{{ props.item.reg_id }}</td>
                    <td class="text-xs-center">{{ props.item.INST_NAME }}</td>
                    <td class="text-xs-center">{{ props.item.F16002 }}</td>
                    <td class="text-xs-center">{{ props.item.F16013 }}</td>
                    <td class="text-xs-center">{{ props.item.REG_TIME }}</td>
                    <td class="text-xs-center">
                        <v-btn small depressed color="primary" class="white--text" @click.stop="dialogOpen('1');">
                            <v-icon dark>thumb_up_alt</v-icon>Yes
                        </v-btn>
                        <v-btn small depressed color="grey" class="white--text" @click.stop="dialogOpen('2');">
                            <v-icon dark>thumb_down_alt</v-icon>No 
                        </v-btn>
                    </td>
                </template>
            </v-data-table>            
        </v-card> 
         </v-flex>    
         <v-flex>
              <v-dialog
        v-model="dialog"
        max-width="450"
      >
        <v-card>
          <v-card-title class="headline">정보 공개 요청 {{message}} 하시겠습니까?</v-card-title>
  
         
          <v-card-actions>
            <v-spacer></v-spacer>
  
            <v-btn
              color="green darken-1"
              flat="flat"
              @click="updateOpenYn('1');"
            >
              예
            </v-btn>
  
            <v-btn
              color="green darken-1"
              flat="flat"
              @click="updateOpenYn('1');"
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
import Config from "@/js/config.js";

export default {
    props: [],
    data() {
        return {
            dialog: false,
            message: '승인',
            reqFlag: true,
            results: [],
            rowsPerPageItems: [10, 20, 30, 50],
            headers: [
                {
                    text: "reqID",
                    align: "center",
                    sortable: false,
                    value: "reg_id"
                },
                {
                    text: "신청기관",
                    align: "center",
                    sortable: false,
                    value: "INST_NAME"
                },
                { text: "지수", align: "center", value: "F16002" },
                { text: "지수코드", align: "center", value: "F16013" },
                { text: "요청일자", align: "center", value: "REG_TIME" },
                { text: "요청처리", align: "center", value: "req_process" }
            ]
        };
    },
    mounted: function() {
        this.getInfoOpenReqList();
    },
    created: function() {},
    beforeDestroy() {},
    methods: {
        getInfoOpenReqList: function() {
            console.log("getInfoOpenReqList");
            var vm = this;

            axios
                .get(Config.base_url + "/user/index/getinfoopenreqlist", {
                    params: {
                        // "bbs_id" : vm.bbs_id,
                        // "seloption" : vm.seloption,
                        // "searchinfo" : vm.searchinfo,
                        // "curPage": vm.curPage,
                        // "perPage": vm.perPage
                    }
                })
                .then(function(response) {
                    // console.log(response);
                    if (response.data.success == false) {
                        alert("해당 신청현황이 없습니다");
                    } else {
                        var items = response.data.results;
                        
                        console.log("response=" + JSON.stringify(items));
                        vm.results = items;
                    }
                });
        }, 
        dialogOpen: function(flag) {
            if (flag == '1') {
                this.message = '승인';
                this.reqFlag = true;
            } else {
                this.message = '거절';
                this.reqFlag = false;
            }
            this.dialog = true;
        },
        updateOpenYn: function(flag) {
            this.dialog = false;

            
            axios.post(Confg.base_url + '/user/index/updateOpenYn', {
                params : {
                    flag : flag,
                    reqFlag : reqFlag,
                    JISU_ID : jisu_id,
                    INST_CD : inst_cd
                }
            }).then(function(response) {
                alert("승인처리 되었습니다.");
            })
        }
    }
};
</script>
<style scoped>
table.v-table tbody td,
table.v-table tbody th {
    height: 30px;
}
</style>
