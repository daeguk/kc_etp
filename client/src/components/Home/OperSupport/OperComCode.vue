<template>
<v-container>
    <v-layout row wrap class="content_margin">
        <v-flex grow xs12>
            <v-card flat>
                <v-card-title primary-title >
                    <h3 class="headline w100" pb-0 >
                        발행사 코드
                    </h3>
                </v-card-title>
            </v-card>
            <v-card flat>
                <div class="table-box-wrap">
                    <div class="table-box" style="min-height:690px;">
                        <table class="tbl_type" >
                            <caption>헤더 고정 테이블</caption>
                            <colgroup>
                                <col width="20%" />
                                <col width="80%" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th width="20%" class="txt_left">발행사코드</th>
                                    <th width="80%" class="txt_left">발행사 한글약명</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="( item, index ) in show_data_list"    :key="'oper_' + index" >
                                    <td class="txt_left">{{ item.inst_cd }}</td>
                                    <td class="txt_left">{{ item.inst_name }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </v-card>
        </v-flex>
        
    </v-layout>
</v-container>
</template>

<script>

var table01 = null;

export default {

    props : [ "org_data_list" ],

    data() {
        return {
                show_data_list  :   []
        }
    },

    components: {
    },    

    created() {
        var vm = this;
    },

    mounted() {
        var vm = this;

        vm.show_data_list   =   vm.org_data_list;
    },

    methods: {
    }
};
</script>