<template>
  <v-app>
    <v-card class="m_intro_bg">
      <v-layout row wrap>
        <v-flex xs12 text-xs-center>
          <div class="m_intro_logo">EMP<span>ETP Management<br> Platform</span>
              <p>Built to create, manage and analyze capital market <br> 
                  Live simple, it's all in EMP</p>
          </div>
        </v-flex>
        <v-flex xs12>
          <div class="text-xs-center">
            <v-btn outline color="#85c406" @click="doView">둘러보기</v-btn>
            <v-btn depressed color="#85c406" dark @click="doLogin">LOG-IN</v-btn>
          </div>
        </v-flex>
        
      </v-layout>
      <UserLoginModal v-if="login_flag" ></UserLoginModal>
      <UserSignupModal v-if="signup_flag" ></UserSignupModal>
      <UserFindPwdModal v-if="findpwd_flag" ></UserFindPwdModal>
    </v-card>
  </v-app>
</template> 



<script>

import UserLoginModal       from './M_UserLoginModal.vue';
import UserSignupModal       from './M_UserSignupModal.vue';
import UserFindPwdModal       from './M_UserFindPwdModal.vue';


export default {
    data() {
        return {
          login_flag: false,
          signup_flag: false,
          findpwd_flag: false,
        };
    },
    components: {
      UserLoginModal: UserLoginModal,
      UserSignupModal: UserSignupModal,
      UserFindPwdModal: UserFindPwdModal,
    },
    beforeCreate() {
    },
    created: function() {
      this.$EventBus.$on('MCloseLoginModal', this.closeLoginModal);
      this.$EventBus.$on('MCloseNewAccountModal', this.closeNewAccountModal);
      this.$EventBus.$on('MCloseFindPwdModal', this.closeFindPwdModal);
      this.$EventBus.$on('MUserLoginCheck', this.userLoginCheck);
      this.$EventBus.$on('MUserNewAccount', this.userNewAccount);
      this.$EventBus.$on('MForgotPassword', this.forgotPassword);
    },
    beforeDestroy() {
      this.$EventBus.$off('MCloseLoginModal');
      this.$EventBus.$off('MCloseNewAccountModal');
      this.$EventBus.$off('MCloseFindPwdModal');
      this.$EventBus.$off('MUserLoginCheck');
      this.$EventBus.$off('MUserNewAccount');
      this.$EventBus.$off('MForgotPassword');
    },

    methods: {
      doView: function() {
        this.$EventBus.$emit("MEnterService");
      },
      doLogin: function() {
        if (this.login_flag) this.login_flag = false;
        else this.login_flag = true
      },
      closeLoginModal: function() {
        this.login_flag = false;
      },
      closeNewAccountModal: function() {
        this.signup_flag = false;
      },
      closeFindPwdModal: function() {
        this.findpwd_flag = false;
      },
      userLoginCheck: function(success) {
        // console.log('userLoginCheck');
        // console.log("email : " + this.$store.state.user.email);
        this.login_flag = false;
        if(success == true) {
          this.$EventBus.$emit("MEnterService");
        }
      },
      userNewAccount: function() {
        this.login_flag = false;
        this.signup_flag = true;
      },
      forgotPassword: function() {
        this.login_flag = false;
        this.findpwd_flag = true;
      },
    }
}
</script>

<style scoped>
</style>