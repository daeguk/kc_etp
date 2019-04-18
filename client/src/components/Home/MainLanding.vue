<template>
  <v-app>
    <v-card>
      <v-img
        class="white--text"
        height="1200px"
        src="/assets/img/main.jpg"
        gradient="to top, rgba(0,0,0,0.5), rgba(0,0,0,0.5)"
      >
        <v-container>
          <v-layout row wrap>
            <v-flex md12>
              <div class="text-xs-center">
                <span class="headline">ETP PLATFORM</span>
              </div>
            </v-flex>
            <v-flex md12>
              <div class="text-xs-center">
                <v-btn outline color="blue darken-1" @click="doView">둘러보기</v-btn>
                <v-btn color="info darken-1" @click="doLogin">로그인</v-btn>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-img>
    </v-card>
  </v-app>
</template> 

<script>

export default {
    data() {
        return {
        };
    },
    components: {
    },
    beforeCreate() {
    },
    created: function() {
    },
    beforeDestroy() {
    },

    methods: {
      doView: function() {
        this.$EventBus.$emit("enterService");
      },
      doLogin: function() {
        this.$EventBus.$emit("enterService");
      },
    }
}
</script>

<style scoped>
</style>