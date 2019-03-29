<template>
<v-navigation-drawer fixed app clipped width="240" class="drawer-style" id="style-1">
<v-list dense expand subheader>
  <v-list-group
    v-for="item in items"
    v-model="item.active"
    :key="item.title"
    :prepend-icon="item.action"
    no-action
  >
  <v-list-tile slot="activator">
    <v-list-tile-content>
      <v-list-tile-title>{{ item.title }}</v-list-tile-title>
    </v-list-tile-content>
  </v-list-tile>
    <v-list-tile
      v-for="subItem in item.subitems"
      :key="subItem.title"
    >
    <v-list-tile-content>
      <v-list-tile-title><router-link class="routerlink" :to="subItem.link">{{ subItem.title }}</router-link></v-list-tile-title>
    </v-list-tile-content>
    </v-list-tile>
  </v-list-group>
</v-list>
</v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          action: 'equalizer',
          title: 'INDEX',
          active: true,
          subitems: [
            { title: '지수관리', link: '/index/manage' },
            { title: '지수등록', link: '/index/register'  },
            { title: '지수개발', link: '/index/develop'  },
            { title: 'datepicker 테스트', link: '/index/datepickerTest'  },
            { title: 'Vue Table 테스트', link: '/index/vueTableTest'  },
            { title: 'Toast Grid 테스트', link: '/index/toastGridTest'  },
            { title: 'Toast Grid 테스트', link: '/index/toastGridTest'  }
          ],
        },
        {
          action: 'accessibility_new',
          title: 'ETP',
          active: true,
          subitems: [
            { title: 'ETP 운용 관리', link: '/etp/manage' },
            { title: 'ETP 신규 등록', link: '/etp/register'  },
            { title: '계약지수 목록', link: '/etp/contract'  }
          ],
        },
        {
          action: 'dashboard',
          title: '시장정보',
          active: true,
          subitems: [
            { title: 'ETP 시장정보', link: '/info/etpinfo' },
            { title: '기초지수 시장정보', link: '/info/indexinfo' },
          ],
        },
        {
          action: 'schedule',
          title: 'TODAY',
          active: true,
          subitems: [
            { title: 'TODAY1', link: '/today/today1' },
            { title: 'TODAY2', link: '/today/today1'  },
            { title: 'TODAY3', link: '/today/today1'  }
          ],
        },
        {
          action: 'account_balance',
          title: 'SUPPORT',
          active: true,
          subitems: [
            { title: '기초지수코드정보', link: '/index/manage' },
            { title: '지수채용주식수', link: '/index/register'  },
            { title: '기초지수종가', link: '/index/develop'  },
            { title: '추적오차율 괴리', link: '/index/develop'  },
          ],
        },
        {
          action: 'account_circle',
          title: 'ADMIN',
          active: true,
          subitems: [
            { title: '회원관리', link: '/index/manage' },
            { title: '지수관리', link: '/index/register'  },
            { title: 'ETP관리', link: '/index/develop'  },
          ],
        },
        {
          action: 'sample',
          title: 'SAMPLE',
          active: true,
          subitems: [
            { title: 'datepicker 테스트', link: '/index/datepickerTest'  },
            { title: 'Vue Table 테스트', link: '/index/vueTableTest'  },
            { title: 'Toast Grid 테스트', link: '/index/toastGridTest'  },
            { title: 'chart and grid', link: '/sample/test'  },
            { title: 'upload', link: '/sample/upload'  },
          ],
        },
        
      ] //item
    }; // return
  },
  created: function() {
  },
  beforeDestroy() {
  },

  methods: {
  }
}
</script>

<style scoped>
#style-1::-webkit-scrollbar {
    width: 6px;
    background-color: #fff;
  }

  #style-1::-webkit-scrollbar-thumb {
    background-color: #e5e5e5; 

  }

  #style-1::-webkit-scrollbar-track {
    /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);*/
    background-color: #fff;
  }
</style>


<!--
<style scoped>
#style-1::-webkit-scrollbar {
    width: 6px;
    background-color: #F5F5F5;
  }

  #style-1::-webkit-scrollbar-thumb {
    background-color: #F90; 
    background-image: -webkit-linear-gradient(90deg, rgba(255, 255, 255, .2) 25%,
                        transparent 25%,
                        transparent 50%,
                        rgba(255, 255, 255, .2) 50%,
                        rgba(255, 255, 255, .2) 75%,
                        transparent 75%,
                        transparent)
  }

  #style-1::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #F5F5F5;
  }
</style>
-->