<template>
<div>
<v-dialog v-model="loginDialog" persistent max-width="400px">
    <v-btn slot="activator" outline color="primary" dark>Login</v-btn>
    <v-card>
        <v-card-text>
        <v-container grid-list-md>
            <v-layout wrap>
            <v-flex xs12>
                <v-text-field label="Email"></v-text-field>
            </v-flex>
            <v-flex xs12>
                <v-text-field label="Password" type="password"></v-text-field>
            </v-flex>
            </v-layout>
        </v-container>
        </v-card-text>
        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="loginDialog = false">LOGIN</v-btn>
        <v-btn color="blue darken-1" flat @click="loginDialog = false">CLOSE</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
<v-dialog v-model="signupDialog" persistent max-width="600px">
    <v-btn slot="activator" outline color="warning" dark>SingUp</v-btn>
    <v-card>
        <v-card-title>
        <span class="headline">User Profile</span>
        </v-card-title>
        <v-card-text>
        <v-container grid-list-md>
            <v-layout wrap>
            <v-flex xs12 sm6 md4>
                <v-text-field label="Legal first name*" required></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
                <v-text-field label="Legal middle name" hint="example of helper text only on focus"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
                <v-text-field
                label="Legal last name*"
                hint="example of persistent helper text"
                persistent-hint
                required
                ></v-text-field>
            </v-flex>
            <v-flex xs12>
                <v-text-field label="Email*" required></v-text-field>
            </v-flex>
            <v-flex xs12>
                <v-text-field label="Password*" type="password" required></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
                <v-select
                :items="['0-17', '18-29', '30-54', '54+']"
                label="Age*"
                required
                ></v-select>
            </v-flex>
            <v-flex xs12 sm6>
                <v-autocomplete
                :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                label="Interests"
                multiple
                ></v-autocomplete>
            </v-flex>
            </v-layout>
        </v-container>
        <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="signupDialog = false">Close</v-btn>
        <v-btn color="blue darken-1" flat @click="signupDialog = false">Save</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
      <!--
    <v-btn outline color="indigo">Sign In</v-btn>
    <v-btn outline color="indigo">Sign Up</v-btn>
    -->
</div>
</template>

<script>
export default {
    data() {
        return {
            loginDialog: true,
            signupDialog: false,
        };
    },
    methods: {

    }
}
</script>

<style scoped>

</style>