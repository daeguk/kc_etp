<template>
<div>
  <div v-if="login_flag">
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat color="white"><v-badge overlap color="orange">
        <span slot="badge">3</span>
        <v-icon large color="grey">notifications</v-icon>
      </v-badge></v-btn>
      <v-btn flat color="white"><v-avatar
        :tile="tile"
        :size="avatarSize"
        color="gray lighten-4">
        <img src="/assets/img/avatar.png" alt="avatar">
      </v-avatar></v-btn>
      <v-btn flat color="primary">[{{user_inst_name}}] {{user_name}}</v-btn>
      <v-btn flat @click="outService">LOG-OUT</v-btn>
    </v-toolbar-items>
  </div>
  <div v-if="!login_flag">
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat @click="outService">LOG-IN</v-btn>
    </v-toolbar-items>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      login_flag: false,
      user_email: "",
      user_name: "",
      user_inst_name: "",
      tile: false,
      avatarSize: "36px",
    };
  },
  mounted: function() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo: function() {
      this.user_email = this.$store.state.user.user_email;
      this.user_name = this.$store.state.user.user_name;
      this.user_inst_name = this.$store.state.user.user_inst_name;
      if(this.user_name == "" || this.user_name == undefined) {
        this.login_flag = false;
      }else {
        this.login_flag = true;
      }
    },
    outService: function() {
      console.log("UserInfo.vue....... outService...");
      // Home.vue
      this.$EventBus.$emit("outService");

    }
  }
}
</script>

<style scoped>

</style>