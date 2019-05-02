<template>
    <v-layout row wrap>
        <v-flex xs12>

            <v-tabs slot="extension" v-model="tab" align-with-title light>
                <v-tabs-slider color="#1e99e8"></v-tabs-slider>

                <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
            </v-tabs>


            <v-tabs-items v-model="tab">

        <!-- ETP 운영정보 -->
                <v-tab-item>
                    <EtpOperInfo></EtpOperInfo>
                </v-tab-item>

        <!-- 지수관리 -->
                <v-tab-item>
                    <EtpOperIndexManage></EtpOperIndexManage>
                </v-tab-item>

        <!-- PDF 관리 -->
                <v-tab-item>
                    <EtpOperPdfManage></EtpOperPdfManage>
                </v-tab-item>

            </v-tabs-items>


        </v-flex>
    </v-layout>
</template>

<script>
import EtpOperInfo from "./EtpOperInfo.vue";
import EtpOperIndexManage from "./EtpOperIndexManage.vue";
import EtpOperPdfManage from "./EtpOperPdfManage.vue";

export default {
    data() {
        return {
            tab: null,
            items: ["ETP 운용정보", "지수관리", "PDF 관리"]
        };
    },
    components: {
        EtpOperInfo: EtpOperInfo,
        EtpOperIndexManage: EtpOperIndexManage,
        EtpOperPdfManage: EtpOperPdfManage
    }
};
</script>
