<template>
    <v-card flat class="summary_box">
            <v-card-title class="summary_box_tit">{{item.title}} </v-card-title>
            <div class="box-sub_w">
                    <div class="box-subtitle">
                        {{item.subTitle}}<br>Last Updated : {{item.updateDate}}
                    </div>
                    <div class="index_num1">{{item.count}}</div>
            </div>
    </v-card>
</template>

<script>
import Config       from "@/js/config.js"

export default {
    props:['item'],
    data() {
        return {
        };
    },    
    components: {
    },
    created: function() {
    },
    mounted: function() {
        this.getIndexInfo();
    },
    methods: {
        getIndexInfo: function() {
            var vm = this;
            var url = "";
            var params = "";
            if (vm.item.mode == '1') {
                url = Config.base_url + "/user/index/getShareReqCnt";
                params = {state : ''}
            } else {
                url = Config.base_url + "/user/index/getIndexRegStateCnt";
                if (vm.item.mode == '2') {
                    params = {state : '01'}
                } else if (vm.item.mode == '3') {
                    params = {state : '02'}
                } else if (vm.item.mode == '4') {
                    params = {state : '03'}
                }
            }
            vm.$emit("showProgress", true ); 
            axios.get(url, {
                        params
            }).then(function(response) {
                // console.log(response);
                if (response.data.success == false) {
                } else {
                    if (response.data.results) {
                        vm.item.count = response.data.results[0].count;
                        vm.item.updateDate = response.data.results[0].updateDate;
                    }
                }
                vm.$emit("showProgress", false); 
            }).catch(error => {
                vm.$emit("showProgress", false ); 
                vm.$emit("showMessageBox", '확인','서버로 부터 응답을 받지 못하였습니다.',{},4);             
            });
        },    
    }
}
</script>

<style scoped>
.card_title {
    padding: 10px 20px 10px 20px;
}

h1 {
    font-size: 36px;
    padding: 10px 0px;
}
.box-subtitle {
    font-size: 12px;
}
</style>