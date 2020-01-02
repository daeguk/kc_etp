<template>
  <div>
    <div v-if="login_flag">
      <v-toolbar-items class="hidden-sm-and-down">
        <!--v-btn flat color="white"><v-badge overlap color="#56bf98">
        <span slot="badge">3</span>
        <v-icon large color="grey">notifications</v-icon>
        </v-badge></v-btn-->
        <!--
      <v-btn flat color="white"><v-avatar
        :tile="tile"
        :size="avatarSize"
        color="gray lighten-4">
        <img src="/assets/img/avatar.png" alt="avatar">
      </v-avatar></v-btn>
        -->
        <v-btn flat color="#ffffff" @click="updateUserInfo">[{{user_inst_name}}] {{user_name}}</v-btn>
        <v-btn flat @click="outService">LOG-OUT</v-btn>
      </v-toolbar-items>
      <UserUpdateModal v-if="updateUser_flag"></UserUpdateModal>
    </div>
    <div v-if="!login_flag">
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat @click="outService">LOG-IN</v-btn>
      </v-toolbar-items>
    </div>
  </div>
</template>

<script>
  import UserUpdateModal from './UserUpdateModal.vue';
  export default {
    data() {
      return {
        login_flag: false,
        updateUser_flag: false,
        user_email: "",
        user_name: "",
        user_inst_name: "",
        tile: false,
        avatarSize: "36px",
      };
    },
    components: {
      UserUpdateModal: UserUpdateModal,
    },
    created: function() {
      this.$EventBus.$on('closeUserUpdateModal', this.closeUserUpdateModal);
    },
    beforeDestroy() {
      this.$EventBus.$off('closeUserUpdateModal');
    },
    mounted: function() {
      this.getUserInfo();
    },
    methods: {
      closeUserUpdateModal: function() {
        this.updateUser_flag = false;
      },
      getUserInfo: function() {
        this.user_email = this.$store.state.user.email;
        this.user_name = this.$store.state.user.name;
        this.user_inst_name = this.$store.state.user.inst_name;
        if(this.user_name == "" || this.user_name == undefined) {
          this.login_flag = false;
        } else {
          this.login_flag = true;
        }
      },
      updateUserInfo: function() {
        this.updateUser_flag = true;
      },
      outService: function() {
        // console.log("UserInfo.vue....... outService...");
        // Home.vue
        this.$EventBus.$emit("outService");
      }
    }
  }
</script>
<style scoped>
</style>