<template>
  <v-container>
    <v-flex>
      <v-dialog v-model="findpwdDialog" persistent max-width="600px">
        <v-card>
          <v-container>
            <v-layout wrap>
            <v-flex xs12 class="login_pop_pad">
                <v-card-title> 비밀번호 찾기
                      <v-spacer></v-spacer>
                      <v-btn flat small icon @click.stop="closeModal">
                          <v-icon>close</v-icon>
                      </v-btn>
                </v-card-title>
            </v-flex>
            <v-flex xs12 md6>
              <v-select
                :items="typeList"
                item-text="type_name"
                item-value="type_cd"
                label="사용자 그룹*"
                dense
                v-model="editedItem.type_cd"
              ></v-select>
            </v-flex>
            <v-flex xs12 md6>
              <v-select
                :items="comDomainList"
                item-text="inst_name"
                item-value="inst_cd"
                label="기관명*"
                dense
                v-model="editedItem.inst_cd"
                @change="setDomain"
              ></v-select>
            </v-flex>
            <v-flex xs12 md6>
              <v-text-field v-model="editedItem.in_email" label="EMAIL ID"></v-text-field>
            </v-flex>
            <v-flex xs12 md6>
              <v-text-field readonly v-model="editedItem.domain_url"></v-text-field>
            </v-flex>
            <v-flex xs12 class="login_pop_pad">
              <v-card-title>
                  <v-spacer></v-spacer>
                  <v-btn  depressed color="primary" outline @click.stop="findPassword">FIND PASSWORD</v-btn>
              </v-card-title>
            </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-container>
</template>

<script>
import Config       from "@/js/config.js"
import Constant from "@/store/store_constant.js"

export default {
  data() {
    return {
        findpwdDialog: true,
        editedItem: {
          type_cd: "0000",
          inst_cd: "00000",
          in_email: "",
          email: "",
          domain_url: "",
        },
        typeList: [],
        domainList: [],
        status: 0,
    };
  },
  computed: {
    comDomainList: function() {
      var vm = this;
      if(this.domainList.length == 0) {
        return this.domainList;
      }else {
        var filtered = this.domainList.filter(function(list) {
          if(vm.editedItem.type_cd == list.type_cd) return true;
          else return false;
        });
        return filtered;
      }
    },
  },  
  mounted: function() {
    // console.log("LoginInfo......");
    this.getMemberTypeList();
    this.getMemberDomainList();
  },
  methods: {
    closeModal: function() {
        if (this.status == 0) {
            this.findpwdDialog = false;
            // MainLanding.vue
            this.$EventBus.$emit("MCloseFindPwdModal");
        }

    },
    getMemberTypeList: function() {
      console.log('getMemberTypeList');
      var vm = this;

      axios.get(Config.base_url+'/user/member/getmembertypelist', {
        params: {
          // "bbs_id" : vm.bbs_id,
        }
      }).then(async function(response) {
        console.log(response);
        if(response.data.success == false){
           vm.status = 1;            
            if( await vm.$root.confirmt.open('확인',response.data.message,{},1) ) {
                if(vm.$root.confirmt.val == 'Y') {
                    vm.status = 0;
                    return  false;
                }
            }
        }else {
          vm.typeList = response.data.results;
        }
      });
    },
    getMemberDomainList: function() {
      console.log('getMemberDomainList');
      var vm = this;

      axios.get(Config.base_url+'/user/member/getmemberdomainlist', {
        params: {
          // "bbs_id" : vm.bbs_id,
        }
      }).then(async function(response) {
        console.log(response);
        if(response.data.success == false){
            vm.status = 1;
            if( await vm.$root.confirmt.open('확인',response.data.message,{},1) ) {
                if(vm.$root.confirmt.val == 'Y') {
                    vm.status = 0;                
                    return  false;
                }
            }          
        }else {
          vm.domainList = response.data.results;
        }
      });
    },
    setDomain: function() {
      console.log('setDomain');

      var vm = this;
      var filtered = this.domainList.filter(function(list) {
        if(vm.editedItem.inst_cd == list.inst_cd) return true;
        else return false;
      });

      console.log('domain_url : ' + filtered[0].domain_url)
      vm.editedItem.domain_url = "@" + filtered[0].domain_url;
      // vm.editedItem.email = "@" + filtered[0].domain_url;
    },
    async findPassword() {
      var vm = this;
      if(this.editedItem.type_cd.length == 0 || 
        this.editedItem.type_cd == "0000") {

        vm.status = 1;
        if( await vm.$root.confirmt.open('확인',"사용자 그룹을 선택해주세요",{},1) ) {
            if(vm.$root.confirmt.val == 'Y') {
                vm.status = 0; 
                return  false;
            }
        }
      }else if(this.editedItem.inst_cd.length == 0 || 
        this.editedItem.inst_cd == "00000") {

        vm.status = 1;
        if( await vm.$root.confirmt.open('확인',"사용자 기관 코드를 선택해주세요",{},1) ) {
            if(vm.$root.confirmt.val == 'Y') {
                vm.status = 0;             
                return  false;
            }
        }
      }else {
        this.editedItem.email = this.editedItem.in_email + this.editedItem.domain_url;
        if(this.editedItem.email.includes(this.editedItem.domain_url)) {
          axios.post(Config.base_url+'/user/member/userfindpwd', 
            vm.editedItem
          ).then(async function(response) {
            console.log(response);
            if(response.data.success == false){

                vm.status = 1;
                if( await vm.$root.confirmt.open('확인',response.data.message,{},1) ) {
                    if(vm.$root.confirmt.val == 'Y') {
                        vm.status = 0;                     
                        return  false;
                    }
                }
            }else {
                vm.status = 1;
                if( await vm.$root.confirmt.open('확인',"이메일주소로 초기화된 패스워드가 발송되었습니다.",{},1) ) {
                    if(vm.$root.confirmt.val == 'Y') {
                        vm.status = 0;                    
                        return  false;
                    }
                }
            }
          });

        }else {
            vm.status = 1;
            if( await vm.$root.confirmt.open('확인',"이메일 주소는 회사의 도메인주소를 사용하여야 합니다.",{},1) ) {
                if(vm.$root.confirmt.val == 'Y') {
                    vm.status = 0;                    
                    return  false;
                }
            }
        }
      }
    },
  }
}
</script>

<style scoped>

</style>