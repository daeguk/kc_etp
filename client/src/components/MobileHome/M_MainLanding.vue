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
      this.$EventBus.$on('closeLoginModal', this.closeLoginModal);
      this.$EventBus.$on('closeNewAccountModal', this.closeNewAccountModal);
      this.$EventBus.$on('closeFindPwdModal', this.closeFindPwdModal);
      this.$EventBus.$on('userLoginCheck', this.userLoginCheck);
      this.$EventBus.$on('userNewAccount', this.userNewAccount);
      this.$EventBus.$on('forgotPassword', this.forgotPassword);
    },
    beforeDestroy() {
      this.$EventBus.$off('closeLoginModal');
      this.$EventBus.$off('closeNewAccountModal');
      this.$EventBus.$off('closeFindPwdModal');
      this.$EventBus.$off('userLoginCheck');
      this.$EventBus.$off('userNewAccount');
      this.$EventBus.$off('forgotPassword');
    },

    methods: {
      doView: function() {
        this.$EventBus.$emit("enterService");
      },
      doLogin: function() {
        this.login_flag = true;
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
          this.$EventBus.$emit("enterService");
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