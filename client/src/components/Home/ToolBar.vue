<template>
<v-toolbar fixed app light clipped-left color="white" class="elevation-0">
    <v-toolbar-side-icon @click="menuClick"></v-toolbar-side-icon>
    <v-toolbar-title>
        <router-link class="routerlink" :to="`${homeUrl}`">ETP PLATFORM</router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <UserInfo v-if="loginFlag"></UserInfo>
    <LoginInfo v-if="!loginFlag"></LoginInfo>
</v-toolbar>
</template>

<script>
import UserInfo          from './User/UserInfo.vue';
import LoginInfo          from './User/LoginInfo.vue';
import LoginModal          from './User/LoginModal.vue';
import Config       from "@/js/config.js";
import Constant     from '@/store/store_constant.js';

export default {
    data() {
        return {
            isDrawer: true,
            userId: "",
            userName: "",
            loginFlag: false,
            clickLoginFlag: false,
            homeUrl: Config.home_url,
        };
    },
    components: {
        UserInfo: UserInfo,
        LoginInfo: LoginInfo,
        LoginModal: LoginModal
    },
    created: function() {
        this.$EventBus.$on('closeLoginModal', this.closeLoginModal);
    },
    beforeDestroy() {
        this.$EventBus.$off('closeLoginModal');
    },    
    mounted: function() {
		// this.getUserName();
	},
	methods: {
		getUserName() {
			this.userId = this.$store.state.user.userid ;
            this.userName = this.$store.state.user.username ;
            
			if(this.userId == "" || this.userId == undefined) {
                this.logout();
			}else {
                this.loginFlag = true;
				// console.log("Success call...........");
			}
        },
		logout() {
			this.userId = "";
            this.userName = "";
        	this.$store.commit(Constant.DELETE_USER);
            this.$router.push({
                path: Config.home_url
            });
		},
        menuClick: function() {
            console.log('ToolBar menuClick!!!');
            this.isDrawer = !this.isDrawer;
            this.$EventBus.$emit("menuClick", this.isDrawer);
        },
    }
}
</script>

<style scoped>

</style>