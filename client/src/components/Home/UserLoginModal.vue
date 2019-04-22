<template>
<v-dialog v-model="loginDialog" persistent max-width="400px">
  <!--
    <v-btn slot="activator" outline color="primary" dark>Login</v-btn>
    -->
    <v-card>
        <v-card-text>
        <v-container grid-list-md>
            <v-layout wrap>
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
        <v-spacer></v-spacer>
        <v-btn color="success darken-1" flat @click="loginCheck">Sign in to ETP PLATFORM</v-btn>
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
    loginCheck: function() {
      console.log('loginCheck');
      var vm = this;

      axios.post(Config.base_url+'/user/userlogincheck', {
        "email" : vm.email,
        "password" : vm.password,
      }).then(function(response) {
        console.log(response);
        if(response.data.success == false){
            alert(response.data.message);
        }else {
          vm.$store.commit(Constant.ADD_USER, {
            user_email: response.data.results[0].email, 
            user_name: response.data.results[0].name, 
            user_type_cd:response.data.results[0].type_cd, 
            user_type_name:response.data.results[0].type_name, 
            user_inst_cd:response.data.results[0].inst_cd, 
            user_inst_name:response.data.results[0].inst_name, 
          });
          vm.loginDialog = false;
          vm.$EventBus.$emit("userLoginCheck", true);
        }
      });
    }
  }
}
</script>

<style scoped>

</style>