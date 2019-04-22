<template>
<v-dialog v-model="findpwdDialog" persistent max-width="600px">
  <v-card>
    <v-container grid-list-md>
      <v-layout wrap>
      <v-flex xs12 offset-xs10>
        <v-btn flat @click.stop="closeModal">
          <v-icon>close</v-icon>
        </v-btn>
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
      <v-flex xs12 offset-xs9>
          <v-btn color="success darken-1" flat @click="findPassword">FIND PASSWORD</v-btn>
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
      this.findpwdDialog = false;
      // MainLanding.vue
      this.$EventBus.$emit("closeFindPwdModal");

    },
    getMemberTypeList: function() {
      console.log('getMemberTypeList');
      var vm = this;

      axios.get(Config.base_url+'/user/member/getmembertypelist', {
        params: {
          // "bbs_id" : vm.bbs_id,
        }
      }).then(function(response) {
        console.log(response);
        if(response.data.success == false){
          alert(response.data.message);
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
      }).then(function(response) {
        console.log(response);
        if(response.data.success == false){
          alert(response.data.message);
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
    findPassword: function() {
      var vm = this;
      if(this.editedItem.type_cd.length == 0 || 
        this.editedItem.type_cd == "0000") {
        alert("사용자 그룹을 선택해주세요");
      }else if(this.editedItem.inst_cd.length == 0 || 
        this.editedItem.inst_cd == "00000") {
        alert("사용자 기관 코드를 선택해주세요");
      }else {
        this.editedItem.email = this.editedItem.in_email + this.editedItem.domain_url;
        if(this.editedItem.email.includes(this.editedItem.domain_url)) {
          axios.post(Config.base_url+'/user/member/userfindpwd', 
            vm.editedItem
          ).then(function(response) {
            console.log(response);
            if(response.data.success == false){
              alert(response.data.message);
            }else {
              alert("이메일주소로 초기화된 패스워드가 발송되었습니다.");
            }
          });

        }else {
          alert("이메일 주소는 회사의 도메인주소를 사용하여야 합니다.");
        }
      }
    }
  }
}
</script>

<style scoped>

</style>