<template>
  <v-app>
    <v-card>
      <v-img
        class="white--text"
        height="1200px"
        src="/assets/img/main.jpg"
        gradient="to top, rgba(0,0,0,0.5), rgba(0,0,0,0.5)"
      >
        <v-container>
          <v-layout row wrap>
            <v-flex md12>
              <div class="text-xs-center">
                <span class="headline">ETP PLATFORM</span>
              </div>
            </v-flex>
            <v-flex md12>
              <div class="text-xs-center">
                <v-btn outline color="blue darken-1" @click="doView">둘러보기</v-btn>
                <v-btn color="info darken-1" @click="doLogin">로그인</v-btn>
              </div>
            </v-flex>
          </v-layout>
          <UserLoginModal v-if="login_flag"></UserLoginModal>
        </v-container>
      </v-img>
    </v-card>
  </v-app>
</template> 

<script>
import UserLoginModal       from './UserLoginModal.vue';

export default {
    data() {
        return {
          login_flag: false,
        };
    },
    components: {
      UserLoginModal: UserLoginModal,
    },
    beforeCreate() {
    },
    created: function() {
      this.$EventBus.$on('userLoginCheck', this.userLoginCheck);
    },
    beforeDestroy() {
      this.$EventBus.$off('userLoginCheck');
    },

    methods: {
      doView: function() {
        this.$EventBus.$emit("enterService");
      },
      doLogin: function() {
        this.login_flag = true;
      },
      userLoginCheck: function(login_flag) {
        console.log('userLoginCheck');
        console.log("email : " + this.$store.state.user.user_email);
        this.login_flag = login_flag;
        this.$EventBus.$emit("enterService");
      },
    }
}
</script>

<style scoped>
</style>