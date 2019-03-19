<template>
    <v-app>
        <ToolBar></ToolBar>
        <NoticeModal v-if="showModal"></NoticeModal>
        <NavMini v-if="!showFull"></NavMini>
        <NavFull v-if="showFull"></NavFull>
        <HomeContents></HomeContents>
        <Footer></Footer>
    </v-app>
</template> 

<script>

import ToolBar          from './ToolBar.vue';
import NavFull          from './NavFull.vue';
import NavMini          from './NavMini.vue';
import HomeContents     from './HomeContents.vue';
import NoticeModal      from './NoticeModal.vue';
import Footer           from './Footer.vue';

export default {
    data() {
        return {
            showModal: false,
            showFull: true,
        };
    },
    components: {
        ToolBar: ToolBar,
        NavMini: NavMini,
        NavFull: NavFull,
        HomeContents: HomeContents,
        NoticeModal:NoticeModal,
        Footer: Footer,
    },
    beforeCreate() {
        // this.$forceupdate;
    },
    created: function() {
        this.$EventBus.$on('popClose', this.popClose);
        this.$EventBus.$on('menuClick', this.menuClick);
    },
    beforeDestroy() {
        this.$EventBus.$off('popClose');
        this.$EventBus.$off('menuClick');
    },    
    methods: {
        popClose: function() {
            // console.log('popClose');
            this.showModal = false;
        },
        menuClick: function(isDrawer) {
            console.log('Home menuClick');
            this.showFull = isDrawer;
        },
    }
}
</script>

<style scoped>


</style>