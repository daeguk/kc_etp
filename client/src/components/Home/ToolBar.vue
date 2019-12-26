<template>
<v-toolbar fixed app clipped-left clipped-right dark color="#434343" class="elevation-0"  style="z-index:100;">
  <!--v-toolbar-side-icon @click="menuClick"></v-toolbar-side-icon-->
  <!--
  <v-toolbar-title v-on:mouseover="showContextMenu($event)">
  -->
  <v-toolbar-title>
    <div class="logo_w">
      <a class="routerlink logo" @click="moveHome">EMP<span>ETP Management<br> Platform</span></a>
    </div>
  </v-toolbar-title>
  <ContextMenu v-show="isContext" @menuClick="menuClick"></ContextMenu>
  <span class="top_cont_title">{{menuTitle}}</span>
  <v-spacer></v-spacer>
  <!--고객지원-->
  <v-btn flat class="support_btn" @click="csDialog=true"><v-icon>send</v-icon> 고객지원</v-btn>
  <v-dialog v-model="csDialog" persistent max-width="500px">
    <v-card flat class="support" height="440px">
      <v-card-title>
        <h5>고객지원</h5>
        <v-spacer></v-spacer>
        <v-btn icon @click="csDialog=false"><v-icon>close</v-icon></v-btn>
      </v-card-title>
      <v-card-title>
        <p>서비스 관련 문의 및 개선해야 할 사항을 남겨주시면 빠른시간 내에 답변 드리겠습니다.</p>
        <v-textarea label="" outline color="blue" height="220px"    ref="contents"    v-model="contents" :placeholder="defaultContents"></v-textarea>
      </v-card-title>
      <div class="text-xs-center">  
          <v-btn dark depressed color="primary" @click="fn_saveCustSupport">전송하기</v-btn>
      </div>
      </v-card>
    </v-dialog>
<!--고객지원end-->  
  <UserInfo></UserInfo>
</v-toolbar>
</template>
<script>
import ContextMenu          from './ContextMenu.vue';
import UserInfo          from './UserInfo.vue';
import Config       from "@/js/config.js";
import Constant     from '@/store/store_constant.js';
import tool       from "@/js/common/tool/tool.js";
import util       from "@/js/util.js";      

export default {
  data() {
    return {
      isContext: true,
      menuTitle: "MARKET ETP INFO",
      clickTimer: 0,
      defaultContents :       "사용자명:\n\n\n"
                          +   "기관명:\n\n\n"    
                          +   "내용:\n\n\n",
      contents :  "",
      csDialog : false
    };
  },
  components: {
    ContextMenu, 
    UserInfo,
  },
  created: function() {
  },
  beforeDestroy() {
  },    
  mounted: function() {
//        this.contents = this.defaultContents;

    /* 지수 사업자 */
    if (this.$store.state.user.type_cd == '0003') {
      this.menuTitle = "지수관리";
    /* ETP 발행사 */
    } else if (this.$store.state.user.type_cd == '0001' 
      || this.$store.state.user.type_cd == '0002' 
      || this.$store.state.user.type_cd == '0004'  
      || this.$store.state.user.type_cd == '9998'  
      || this.$store.state.user.type_cd == '9999') {
      this.menuTitle = "ETP운영관리";
    } else {
      this.menuTitle = "MARKET ETP INFO";
    }
  },
  methods: {
/*
    contextMenuClick: function() {
      console.log('ToolBar contextMenuClick!!!');
      var vm = this;
      this.isContext = !this.isContext;
      vm.clickTimer = 1;
      setTimeout(function() {
        vm.clickTimer = 0;
      }, 1000);
    },
    contextMenuOver: function() {
      console.log('ToolBar contextMenuClick!!!');
      if(this.clickTimer == 0) {
       this.isContext = true;
     }
   },
*/
    menuClick: function(menu) {
    //console.log("menuClick........: " + menu.title);        
        this.menuTitle = menu.title;
    },
    moveHome: function() {
      localStorage.removeItem("finalPath");
      location.reload();
    },

    /*
    *   고객지원 정보를 저장한다.
    *   2019-06-13  bkLove(촤병국)
    */
    async fn_saveCustSupport() {
      var vm = this;

      if(await !vm.contents || vm.contents.length == 0 || vm.contents.replace(/^\s+|\s+$/g,"").length == 0 ) {
        if( vm.$root.confirmt.open('', "내용을 입력해 주세요", {}, 1)) {
          return false;                    
        }                
      }
      util.axiosCall({
        "url"       :   Config.base_url + "/user/etc/saveCustSupport"
        , "data"      :   { contents : vm.contents }
        , "method"    :   "post"
      }, function(response) {
        try{
            var resultData = response.data;
            if( resultData.msg ) {
                if( vm.$root.confirmt.open('', resultData.msg, {}, 1)) {}

                if( !resultData.result ) {
                    return  false;
                }
            }

            if( resultData.result ) {
                vm.contents     =   "";
                vm.csDialog     =   false;
            }
        }catch(ex) {
            console.log( "error", ex );
        }
      }, function(error) {
        if( error ) {
          if ( vm.$root.confirmt.open( '확인', error, {}, 4 ) ) {}
        }
      });
    }
  }
}  
</script>

<style scoped>
  .v-menu__content.menuable__content__active{left:60% !important;}
</style>