<template>
<v-dialog v-model="loginDialog" persistent max-width="600px">
    <v-card>
        <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 offset-xs10>
              <v-btn flat @click.stop="closeModal">
                <v-icon>close</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs12>
                <v-text-field label="Sign in with your e-mail address" v-model="email"></v-text-field>
            </v-flex>
            <v-flex xs12>
                <v-text-field label="Password" type="password" v-model="password" @keyup.enter="loginCheck"></v-text-field>
            </v-flex>
            </v-layout>
        </v-container>
        </v-card-text>
        <v-card-actions>
            <v-layout wrap>
            <v-flex xs12 offset-xs6>
          <v-btn color="success darken-1" flat @click="loginCheck">LOG-IN to ETP PLATFORM</v-btn>
            </v-flex>
            <v-flex xs8>
              <div>
                New to ETP Platform? <a @click="newAccount">Create an account.</a>
              </div>
            </v-flex>
            <v-flex xs4>
              <div>
                <a @click="forgotPassword">Forgot password.</a>
              </div>
            </v-flex>
            </v-layout>
        </v-card-actions>
    </v-card>
</v-dialog>

</template>

<script>
import Config       from "@/js/config.js"
import Constant from "@/store/store_constant.js"

export default {
  data() {
    return {
        loginDialog: true,
        email: "",
        password: "",
    };
  },
  mounted: function() {
    // console.log("LoginInfo......");
  },
  methods: {
    closeModal: function() {
      this.loginDialog = false;
      // MainLanding.vue
      this.$EventBus.$emit("closeLoginModal");

    },
    loginCheck: function() {
      console.log('loginCheck');
      var vm = this;

      axios.post(Config.base_url+'/user/member/userlogincheck', {
        "email" : vm.email,
        "password" : vm.password,
      }).then(function(response) {
        console.log(response);
        if(response.data.success == false){
            alert(response.data.message);
          vm.$EventBus.$emit("userLoginCheck", false);
        }else {
          vm.$store.commit(Constant.ADD_USER, {
            email: response.data.results[0].email, 
            password: vm.password,
            name: response.data.results[0].name, 
            type_cd:response.data.results[0].type_cd, 
            type_name:response.data.results[0].type_name, 
            inst_cd:response.data.results[0].inst_cd, 
            inst_name:response.data.results[0].inst_name, 
            hp_no:response.data.results[0].hp_no, 
            tel_no:response.data.results[0].tel_no, 
          });
          vm.loginDialog = false;
          // MainLanding.vue
          vm.$EventBus.$emit("userLoginCheck", true);
        }
      });
    },
    forgotPassword: function() {
      var vm = this;
      this.loginDialog = false;
      console.log("forgotPassword");
      // MainLanding.vue
      vm.$EventBus.$emit("forgotPassword");
    },
    newAccount: function() {
      var vm = this;
      this.loginDialog = false;
      console.log("newAccount");
      // MainLanding.vue
      vm.$EventBus.$emit("userNewAccount");
    }
  }
}
</script>

<style scoped>

</style>