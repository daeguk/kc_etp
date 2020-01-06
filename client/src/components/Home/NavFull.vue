<template>
  <v-navigation-drawer fixed app clipped width="240" class="drawer-style" id="style-1">
    <v-list dense expand subheader>
      <v-list-group
        v-for="item in items"
        v-model="item.active"
        :key="item.title"
        :prepend-icon="item.action"
        no-action
        color="indigo"
      >
        <v-list-tile slot="activator">
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-for="subItem in item.subitems" :key="subItem.title">
          <v-list-tile-content>
            <v-list-tile-title>
              <router-link class="routerlink" :to="subItem.link">{{ subItem.title }}</router-link>
            </v-list-tile-title>
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
        full_items: [{
          action: 'dashboard',
          title: 'Market Info',
          active: true,
          subitems: [{
            title: 'ETP',
            link: '/info/etpinfo'
          }, {
            title: 'INDEX',
            link: '/info/indexinfo'
          }, ],
        }, {
          action: 'equalizer',
          title: 'INDEX',
          active: true,
          subitems: [{
              title: '지수관리',
              link: '/index/manage/indexSummary'
            }, {
              title: '지수등록',
              link: '/index/register'
            },
            //{ title: '지수개발', link: '/index/develop'  }
          ],
        }, {
          action: 'accessibility_new',
          title: 'ETP',
          active: true,
          subitems: [{
            title: 'ETP 운용 관리',
            link: '/etp/manage'
          }, {
            title: 'ETP 신규 등록',
            link: '/etp/register'
          }, {
            title: '계약지수 목록',
            link: '/etp/contract'
          }],
        }, ], //full_items
        items: [],
      }; // return
    },
    created: function() {},
    beforeDestroy() {},
    mounted: function() {
      var type_cd = this.$store.state.user.type_cd;
      if(type_cd == "") {
        this.items.push(this.full_items[0]);
      } else if(type_cd == "9998" || type_cd == "9999") {
        this.items = this.full_items;
      } else if(type_cd == "0001" || type_cd == "0002" || type_cd == "0004" || type_cd == "0005") {
        this.items.push(this.full_items[0]);
        this.items.push(this.full_items[2]);
      } else if(type_cd == "0003" || type_cd == "0005") {
        this.items.push(this.full_items[0]);
        this.items.push(this.full_items[1]);
      }
    },
    methods: {}
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