<template>
<v-container>


    <v-dialog v-model="message_dialog" persistent :max-width="options.width" @keydown.esc.stop="cancel" @keydown.enter.stop="cancel" v-bind:style="{ zIndex: options.zIndex }">
        <v-card class="pop_alert">
        <h6><v-icon class="confirm">help</v-icon> Confirm</h6>
        <!--h6><v-icon class="warning_1">warning</v-icon> Warning</h6>
        <h6><v-icon class="error_1">error</v-icon> Error</h6-->
            <v-card-title>{{message}}</v-card-title>
  
         
            <v-card-actions>
                <v-spacer></v-spacer>  
            <v-btn class="pop_alret_yesbtn" ref="btn_message_yes" depressed dark small @click.native.stop="agree">확인</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


    <v-dialog v-model="confirm_dialog" persistent :max-width="options.width" @keydown.esc.stop="cancel" @keydown.enter.stop="cancel" v-bind:style="{ zIndex: options.zIndex }">
        <v-card class="pop_alert">
        <h6><v-icon class="confirm">help</v-icon> Confirm</h6>
        <!--h6><v-icon class="warning_1">warning</v-icon> Warning</h6>
        <h6><v-icon class="error_1">error</v-icon> Error</h6-->
            <v-card-title>{{message}}</v-card-title>
  
         
            <v-card-actions>
                <v-spacer></v-spacer>  
            <v-btn class="pop_alret_yesbtn" ref="btn_confirm_yes" depressed dark small @click.native.stop="agree">예</v-btn>
  
            <v-btn class="pop_alret_nobtn" depressed dark small @click.native.stop="cancel">아니요</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
      


      <v-dialog v-model="warning_dialog" persistent :max-width="options.width" @keydown.esc.stop="cancel" @keydown.enter.stop="cancel" v-bind:style="{ zIndex: options.zIndex }">
        <v-card class="pop_alert">
        <h6><v-icon class="warning_1">warning</v-icon> Warning</h6>
        <!--h6><v-icon class="warning_1">warning</v-icon> Warning</h6>
        <h6><v-icon class="error_1">error</v-icon> Error</h6-->
            <v-card-title>{{message}}</v-card-title>
  
         
            <v-card-actions>
                <v-spacer></v-spacer>  
            <v-btn class="pop_alret_yesbtn" ref="btn_warning_yes" depressed dark small @click.native.stop="agree">확인</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


      <v-dialog v-model="error_dialog" persistent :max-width="options.width" @keydown.esc.stop="cancel" @keydown.enter.stop="cancel" v-bind:style="{ zIndex: options.zIndex }">
        <v-card class="pop_alert">
        <h6><v-icon class="error_1">error</v-icon> Error</h6>
        <!--h6><v-icon class="warning_1">warning</v-icon> Warning</h6>
        <h6><v-icon class="error_1">error</v-icon> Error</h6-->
            <v-card-title>{{message}}</v-card-title>
  
         
            <v-card-actions>
                <v-spacer></v-spacer>  
            <v-btn class="pop_alret_yesbtn" ref="btn_error_yes" depressed dark small @click.native.stop="agree">확인</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
</v-container>    
</template>

<script>

export default {
    data: () => ({
        confirm_dialog: false,
        message_dialog: false,
        warning_dialog: false,
        error_dialog: false,
        kind : 0,
        resolve: null,
        val: null,
        reject: null,
        message: null,
        title: null,
        options: {
            color: 'primary',
            width: 400,
            zIndex: 200
        }
    }),
    methods: {
        open(title, message, options, kind) {
            if (kind == 1) {
                this.message_dialog = true;
                this.$nextTick(() => this.$refs.btn_message_yes.$el.focus());
            } else if (kind == 2) {
                this.confirm_dialog = true;
                this.$nextTick(() => this.$refs.btn_confirm_yes.$el.focus());
            } else if (kind == 3) {
                this.warning_dialog = true;
                this.$nextTick(() => this.$refs.btn_warning_yes.$el.focus());
            } else if (kind == 4) {
                this.error_dialog = true;
                this.$nextTick(() => this.$refs.btn_error_yes.$el.focus());
            }

            this.kind = kind;
            this.title = title;
            this.message = message;
            this.options = Object.assign(this.options, options);

            return new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            })
        },
        agree() {
            if (this.kind == 1) {
                this.message_dialog = false;
            } else if (this.kind == 2) {
                this.confirm_dialog = false;
            } else if (this.kind == 3) {
                this.warning_dialog = false;
            } else if (this.kind == 4) {
                this.error_dialog = false;
            }

            this.val = 'Y';
            this.resolve(true);            
        },
        cancel() {
            if (this.kind == 1) {
                this.message_dialog = false;
            } else if (this.kind == 2) {
                this.confirm_dialog = false;
            } else if (this.kind == 3) {
                this.warning_dialog = false;
            } else if (this.kind == 4) {
                this.error_dialog = false;
            }

            this.val = 'N';
            this.resolve(true);            
        }
    }
}
</script>