<template>
<v-container>
    <v-layout row wrap class="content_margin">
        <v-flex grow xs12>
            <v-card flat>
                <v-card-title primary-title >
                    <h3 class="headline w100" pb-0 >
                        운용사 코드
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
                                    <th width="20%" class="txt_left">운용사코드</th>
                                    <th width="80%" class="txt_left">운용사 한글약명</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="txt_left">003019</td>
                                    <td class="txt_left">DB자산운용</td>
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