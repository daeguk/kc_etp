<template>
    <v-container>
    <v-flex>

<v-dialog v-model="loginDialog" persistent max-width="600px">
    <v-card>
        <v-container>
          <v-layout wrap>
            <v-flex xs12 class="login_pop_pad">
            <v-card-title>LOGIN
                <v-spacer></v-spacer>
                <v-btn icon small flat @click.stop="closeModal">
                <v-icon>close</v-icon>
              </v-btn></v-card-title>
            </v-flex>
            <v-flex xs12>
                <v-text-field label="Sign in with your e-mail address" v-model="email"></v-text-field>
            </v-flex>
            <v-flex xs12>
                <v-text-field label="Password" type="password" v-model="password" @keyup.enter.stop="loginCheck"></v-text-field>
            </v-flex>
            </v-layout>
        <v-card flat>
            <v-layout wrap>
            <v-flex xs12 class="login_pop_pad">
                <v-card-title>
                <v-spacer></v-spacer>
              <v-btn depressed color="#85c406" dark @click.stop="loginCheck">LOG-IN to ETP PLATFORM</v-btn>
                </v-card-title>
            </v-flex>
            <v-flex xs12  class="login_pop_pad2">
                <v-layout>
                    <v-flex>
                         New to ETP Platform? <a @click.stop="newAccount">Create an account.</a>
                    </v-flex>
                    <v-flex>
                         <a @click.stop="forgotPassword">Forgot password.</a>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs4>
            </v-flex>

            
            </v-layout>
        </v-card>
      </v-container>
    </v-card>
</v-dialog>
    </v-flex>

    <v-flex>
        <ConfirmDialog ref="confirm"></ConfirmDialog>
    </v-flex>

    </v-container>

</template>

<script>
import Config       from "@/js/config.js"
import Tool       from "@/js/common/tool/tool.js"
import Constant from "@/store/store_constant.js"
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";

export default {
  data() {
    return {
        loginDialog: true,
        // email: "",
        // password: "",
        email: "test@koscom.co.kr",
        password: "111aaa...",
        status: 0,
    };
  },
  components : {
      ConfirmDialog: ConfirmDialog
  },
  mounted: function() {
  },
  methods: {
    closeModal: function() {
      if (this.status == 0) {
        this.loginDialog = false;
        // MainLanding.vue
        this.$EventBus.$emit("closeLoginModal");
      }
    },
    loginCheck: function() {

      // console.log('loginCheck');
      var vm = this;

      axios.post(Config.base_url+'/user/member/userlogincheck', {
        "email" : vm.email,
        "password" : vm.password,
      }).then(async function(response) {
        // console.log(response);
        if(response.data.success == false){
           vm.status = 1;
           if( await vm.$refs.confirm.open('확인',response.data.message, {}, 1)) {
              if(vm.$refs.confirm.val == 'Y') {
                  vm.status = 0;
                  //vm.$EventBus.$emit("userLoginCheck", false);
              }
           }
        }else {
          vm.$store.commit(Constant.ADD_USER, {
            email: response.data.results[0].email, 
            name: response.data.results[0].name, 
            type_cd:response.data.results[0].type_cd, 
            type_name:response.data.results[0].type_name, 
            inst_cd:response.data.results[0].inst_cd, 
            inst_name:response.data.results[0].inst_name, 
            krx_cd:response.data.results[0].krx_cd, 
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
      let msg = '';
      // this.loginDialog = false;
      console.log("forgotPassword");
      // MainLanding.vue
      // vm.$EventBus.$emit("forgotPassword");
      
      if(Tool.chkEmail(vm.email) == false) {
        msg = "정확한 이메일 주소를 입력하시면, 임시비밀번호를 발송해드립니다.";
      }else {
        msg = "입력하신 이메일 주소로 임시비밀번호를 발송했습니다.";
      }
      alert(msg);
    },
    newAccount: function() {
      var vm = this;
      // this.loginDialog = false;
      console.log("newAccount");
      // MainLanding.vue
      // vm.$EventBus.$emit("userNewAccount");
      let msg = "기관 메일 계정 확인후, 계정을 발급해드리고 있습니다. 담당자에게 문의하시기 바랍니다. (코스콤 정보사업실 민선기 과장 : 02-767-8752)"
      alert(msg);
    },
    showMessageBox: function(title, msg, option, gubun) {
         this.$refs.confirm.open(title,msg, option, gubun);
    }    
  }
}
</script>

<style scoped>

</style>