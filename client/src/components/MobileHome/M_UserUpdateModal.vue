<template>
<v-dialog v-model="updateDialog" persistent max-width="600px">
  <v-card>
    <v-container grid-list-md>
      <v-layout wrap>
     <v-flex xs12 class="login_pop_pad">
          <v-card-title> 개인 정보 수정
                <v-spacer></v-spacer>
                <v-btn icon small flat @click.stop="closeModal">
                    <v-icon>close</v-icon>
                </v-btn>
          </v-card-title>
      </v-flex>
      <v-flex xs12 md6>
        <v-text-field readonly v-model="editedItem.type_name"></v-text-field>
      </v-flex>
      <v-flex xs12 md6>
        <v-text-field readonly v-model="editedItem.inst_name"></v-text-field>
      </v-flex>
      <v-flex xs12 md12>
        <v-text-field readonly v-model="editedItem.email"></v-text-field>
      </v-flex>
      <v-flex xs12 md6>
        <v-text-field v-model="editedItem.password" label="PASSWORD" type="password"></v-text-field>
      </v-flex>
      <v-flex xs12 md6>
        <v-text-field v-model="editedItem.repassword" label="RE-PASSWORD*" type="password"></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-text-field v-model="editedItem.name" label="사용자 이름"></v-text-field>
      </v-flex>
      <v-flex xs12 md6>
        <v-text-field v-model="editedItem.hp_no" label="HP"></v-text-field>
      </v-flex>
      <v-flex xs12 md6>
        <v-text-field v-model="editedItem.tel_no" label="TEL"></v-text-field>
      </v-flex>
      <v-flex xs12 class="login_pop_pad">
          <v-card-title> 
                <v-spacer></v-spacer>
                <v-btn depressed color="primary" outline @click="updateUserInfo">UPDATE</v-btn>
          </v-card-title>
      </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</v-dialog>
</template>

<script>
import Config       from "@/js/config.js"
import Constant from "@/store/store_constant.js"

export default {
  data() {
    return {
        updateDialog: true,
        editedItem: {
          type_cd: "",
          type_name: "",
          inst_cd: "",
          inst_name: "",
          email: "",
          password: "",
          repassword: "",
          name: "",
          hp_no: "",
          tel_no: "",
        },
    };
  },
  computed: {
  },  
  mounted: function() {
    this.getUserInfo();
  },
  methods: {
    closeModal: function() {
      this.updateDialog = false;
      // MainLanding.vue
      this.$EventBus.$emit("closeUserUpdateModal");

    },
    getUserInfo: function() {
      this.editedItem.type_cd = this.$store.state.user.type_cd;
      this.editedItem.type_name = this.$store.state.user.type_name;
      this.editedItem.inst_cd = this.$store.state.user.inst_cd;
      this.editedItem.inst_name = this.$store.state.user.inst_name;
      this.editedItem.email = this.$store.state.user.email;
      this.editedItem.password = this.$store.state.user.password;
      this.editedItem.repassword = this.$store.state.user.password;
      this.editedItem.name = this.$store.state.user.name;
      this.editedItem.hp_no = this.$store.state.user.hp_no;
      this.editedItem.tel_no = this.$store.state.user.tel_no;
    },
    updateUserInfo: function() {
      var vm = this;
      if(this.editedItem.name.length == 0){
        alert("사용자 이름을 입력해주세요");
      }else if(this.editedItem.password.length == 0 || 
        this.editedItem.password.length == 0 ||
        this.editedItem.password != this.editedItem.password){
        alert("패스워드가 잘못 입력되었습니다.");
      }else {
        axios.post(Config.base_url+'/user/member/userupdateinfo', 
          vm.editedItem
        ).then(function(response) {
          console.log(response);
          if(response.data.success == false){
            alert(response.data.message);
          }else {
            alert("사용자 정보 수정이 완료되었습니다.");
          }
        });
      }
    }
  }
}
</script>

<style scoped>

</style>