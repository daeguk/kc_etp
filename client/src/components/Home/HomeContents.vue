<template>
    <v-content>
        <v-container fluid>
            <div id="_content">
            <router-view></router-view>
            </div>
        </v-container>
   </v-content>
</template> 

<script>
import Config       from "@/js/config.js";
export default {
    data() {
        return {
        };
    },
    components: {
    },
    beforeCreate() {
    },
    created: function() {
        /* 지수 사업자 */
        if (this.$store.state.user.type_cd == '0003') {
            this.$router.push({ path: Config.jisu_url });
        /* ETP 발행사 */
        } else if (this.$store.state.user.type_cd == '0001' 
            || this.$store.state.user.type_cd == '0002' 
            || this.$store.state.user.type_cd == '0004'  
            || this.$store.state.user.type_cd == '9998'  
            || this.$store.state.user.type_cd == '9999') {
            this.$router.push({ path: Config.etp_url });
        } else {
            this.$router.push({ path: Config.home_url });
        }
    },
    beforeDestroy() {
    },

    methods: {
    }
}
</script>

<style scoped>
</style>