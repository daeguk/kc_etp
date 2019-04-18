<template>
    <v-dialog v-model="dialog" :max-width="options.width" @keydown.esc="cancel" v-bind:style="{ zIndex: options.zIndex }">
        <v-card class="pop_alert">
        <h6><v-icon class="confirm">help</v-icon> Confirm</h6>
        <!--h6><v-icon class="warning_1">warning</v-icon> Warning</h6>
        <h6><v-icon class="error_1">error</v-icon> Error</h6-->
            <v-card-title>{{message}}</v-card-title>
  
         
            <v-card-actions>
                <v-spacer></v-spacer>  
            <v-btn class="pop_alret_yesbtn" depressed dark small @click.native="agree">예</v-btn>
  
            <v-btn class="pop_alret_nobtn" depressed dark small @click.native="cancel">아니요</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
</template>

<script>

export default {
    data: () => ({
        dialog: false,
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
        open(title, message, options) {
            this.dialog = true;
            this.title = title;
            this.message = message;
            this.options = Object.assign(this.options, options);

            return new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            })
        },
        agree() {
            this.val = 'Y';
            this.resolve(true);
            this.dialog = false;
        },
        cancel() {
            this.val = 'N';
            this.resolve(false);
            this.dialog = false;
        }
    }
}
</script>