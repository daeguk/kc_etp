<template>
    <v-layout row>
        <v-flex xs12>
            <v-card flat>
                <v-card flat class="right_menu_w4">
                    <v-list subheader two-line>
                        <v-subheader class="subheading">기준시총 변동</v-subheader>
                         <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-title>당일(2018.10.11)</v-list-tile-title>
                                <v-list-tile-sub-title>10001000100020
                                    <p>+1000000000</p>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-content>
                                <v-list-tile-title>당일(2018.10.11)</v-list-tile-title>
                                <v-list-tile-sub-title>10001000100020<p> </p></v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>

                    </v-list>
                </v-card>
                <!--종목편출입 테이블-->
                <v-card>
                    <v-subheader class="subheading">종목편출입</v-subheader>
                <v-data-table
                    :headers="headers"
                    :items="desserts"
                    :search="search"
                    hide-actions
                    class="elevation-1 table_line4"
                >
                    <template v-slot:items="props">
                        <td>{{ props.item.name }}</td>
                        <td class="text-xs-left">{{ props.item.name1 }}</td>
                        <td class="text-xs-left">{{ props.item.구분 }}</td>
                        <td class="text-xs-right">{{ props.item.비중 }}</td>
                    </template>
                    <v-alert
                        v-slot:no-results
                        :value="true"
                        color="error"
                        icon="warning"
                    >Your search for  found no results.</v-alert>
                </v-data-table>
                </v-card>
                <!--종목편출입 테이블 end-->

                <!--지수채용주식수변경테이블-->
                    <v-layout>
        <v-flex>
            <v-card>
                <v-subheader class="subheading">지수채용주식수변경</v-subheader>
                <v-data-table
                    :headers="headers2"
                    :items="desserts2"
                    :search="search"
                    hide-actions
                    class="elevation-1 table_line4"
                >
                    <template v-slot:items="props">
                        <td>{{ props.item.name }}</td>
                        <td class="text-xs-left">{{ props.item.name1 }}</td>
                        <td class="text-xs-left">{{ props.item.구분 }}</td>
                        <td class="text-xs-right">{{ props.item.비중 }}</td>
                    </template>
                    <v-alert
                        v-slot:no-results
                        :value="true"
                        color="error"
                        icon="warning"
                    >Your search for  found no results.</v-alert>
                </v-data-table>
            </v-card>
        </v-flex>
    </v-layout>
                <!--지수채용주식수변경테이블 end-->
            </v-card>
        </v-flex>
    </v-layout>
</template>


<script>
export default {
    data() {
        return {
            notifications: false,
            sound: false,
            video: false,
            invites: false,
            dialog: false,
            search: "",
            headers: [
                {
                    text: "CODE11",
                    align: "left",
                    value: "name"
                },
                {
                    text: "종목명",
                    align: "left",
                    value: "name1"
                },
                { text: "구분", value: "구분" },
                { text: "비중(%)", value: "비중" ,align: "right"}
            ],
            desserts: [
                {
                    name: "000000",
                    name1: "메티톡스",
                    구분: "편입",
                    비중: 34.21,
                },
                {
                    name: "000000",
                    name1: "000000",
                    구분: "Kodex일본TOPIX",
                    비중: 26.11,
                },
               {
                    name: "000000",
                    name1: "000000",
                    구분: "Kodex일본TOPIX",
                    비중: 10.2
                },
                {
                    name: "000000",
                    name1: "000000",
                    구분: "Kodex일본TOPIX",
                    비중: 8.5
                },
                {
                    name: "000000",
                    name1: "000000",
                    구분: "Kodex일본TOPIX",
                    비중: 6.0
                },
                {
                    name: "000000",
                    name1: "000000",
                    구분: "Kodex일본TOPIX",
                    비중: 22.2
                }
            ],headers2: [
                {
                    text: "CODE",
                    align: "left",
                    value: "name"
                },
                {
                    text: "종목명",
                    align: "left",
                    value: "name1"
                },
                { text: "구분", value: "구분" },
                { text: "비중(%)", value: "비중", align: "right" }
            ],
            desserts2: [
                {
                    name: "000000",
                    name1: "메티톡스",
                    구분: "편입",
                    비중: 34.21
                },
                {
                    name: "000000",
                    name1: "000000",
                    구분: "Kodex일본TOPIX",
                    비중: 26.11
                },
                {
                    name: "000000",
                    name1: "000000",
                    구분: "Kodex일본TOPIX",
                    비중: 10.2
                },
                {
                    name: "000000",
                    name1: "000000",
                    구분: "Kodex일본TOPIX",
                    비중: 8.5
                },
                {
                    name: "000000",
                    name1: "000000",
                    구분: "Kodex일본TOPIX",
                    비중: 6.0
                },
                {
                    name: "000000",
                    name1: "000000",
                    구분: "Kodex일본TOPIX",
                    비중: 22.2
                }
            ]
        };
    }
};
</script>
