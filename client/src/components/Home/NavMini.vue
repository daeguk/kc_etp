<template>
  <v-navigation-drawer fixed app clipped width="60" class="drawer-style" id="style-1">
    <v-list no-action dense expand subheader class="pt-0">
      <v-list-tile v-for="item in items" :key="item.title">
        <v-list-tile-action>
          <router-link class="routerlink" :to="item.link">
            <v-icon>{{ item.action }}</v-icon>
          </router-link>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  export default {
    data() {
      return {
        items: [{
          action: 'equalizer',
          title: 'INDEX',
          link: '/index/manage',
        }, {
          action: 'accessibility_new',
          title: 'ETP',
          link: '/etp/manage',
        }, {
          action: 'schedule',
          title: 'TODAY',
          link: '/index/manage',
        }, {
          action: 'account_balance',
          title: 'SUPPORT',
          link: '/index/manage',
        }, {
          action: 'account_circle',
          title: 'ADMIN',
          link: '/index/manage',
        }, ] //item
      }; // return
    },
    created: function() {},
    beforeDestroy() {},
    methods: {}
  }
</script>
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
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #F5F5F5;
  }
</style>