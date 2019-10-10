<template>
<v-container>
    <v-layout row wrap class="content_margin">
        <v-flex grow xs12>
            <v-card flat>
                <v-card-title primary-title class="pb-0">
                    <h3 class="headline w100">
                        <div class="incode_search">
                            <v-text-field v-model="search" append-icon="search" label="지수명 검색" single-line hide-details>
                             </v-text-field>
                        </div>
                        <span><button type='button'  class="exceldown_btn" @click.stop="" v></button></span>
                        <span class="btn_r ver2">
                           <IndexCodeModal></IndexCodeModal>
                        </span>
                    </h3>
                </v-card-title>
            </v-card>
            <v-card flat>
                <div class="table-box-wrap">
                    <div class="table-box" style="min-height:670px;">
                        <table class="tbl_type" >
                            <caption>헤더 고정 테이블</caption>
                            <colgroup>
                                <col width="15%" />
                                <col width="15%" />
                                <col width="15%" />
                                <col width="55%" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th width="15%">대</th>
                                    <th width="15%">중</th>
                                    <th width="15%">소</th>
                                    <th width="55%" class="txt_left">지수명</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>K</td>
                                    <td>0</td>
                                    <td>00001</td>
                                    <td class="txt_left">KOSPI1200</td>
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

import IndexCodeModal from "@/components/Home/OperSupport/IndexCodeModal.vue";

export default {

  data() {
    return {
        dialog: false,
    }
    
  }, 
  components: {
        IndexCodeModal : IndexCodeModal,
    },

} 
</script>