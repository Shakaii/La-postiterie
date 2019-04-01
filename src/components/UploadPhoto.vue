<template>
    <div class="upload-container">
        <el-button type="primary" plain @click="uploadClick"> Exporter sur google drive <i class="material-icons">cloud_upload</i></el-button>
        <div class="input">
            <div class="checkboxContainer">
                <el-checkbox id="checkbox" type="checkbox" v-model="useGmail" v-on:change="updateGmail">Envoyer le lien sur mon adresse gmail</el-checkbox>
            </div>
            <el-input v-bind:class="{ formValid: (isEmailValid && email.length >= 1), formInvalid: (!isEmailValid && email.length >= 1)}" @change="checkEmail" v-if="useGmail == false" id="email" placeholder="adresse email" type="text" v-model="email">
                <template slot="prepend"><i class="material-icons">email</i></template>
            </el-input>
        </div>     
    </div> 
</template>

<script>
export default {
    name: 'UploadPhoto',
    data () {
        return {
            email: "",
            useGmail: true,
            isEmailValid: false
        };
    },
    mounted(){
        //if email was saved we check it first at creation
        if (this.email){
            this.checkEmail();
        }
    },
    methods: {
        checkEmail(){
            let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
            if (regex.test(this.email)){
                this.isEmailValid = true;
            }
            else {
                this.isEmailValid = false;
            }
            this.inputChange();
        },
        updateGmail(){
            this.$emit('updateGmail', this.useGmail);
        },
        uploadClick(){
            this.$emit('uploadClick');
        },
        inputChange(){
            this.$emit('inputChange', this.email, this.isEmailValid);
        },
    },
    created: function(){

        if (localStorage.getItem('email')){
            this.email = localStorage.getItem('email');
            this.inputChange();
        }
      
    }
};
</script>

<style scoped>

    .checkboxContainer{
        margin-top: 1em;
        display:flex;
        flex-direction:row;
        justify-content: flex-start;
    }

    .formInvalid{
        border-color: #E6A23C!important;
        border-style: solid;
        border-width: 1px;
        border-radius:5px;
    }

    .formValid{
        border-color:#67C23A!important;
        border-style: solid;
        border-width: 1px;
        border-radius:5px;
    }

    .upload-container{
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items:center;
        justify-content:center;
        user-select: none;
    }

    .upload-container .input{
        width: initial;
    }
    
    .upload-container {
        flex-direction: column;
    }

    .checkboxContainer{
        margin-bottom:1em;
    }

    #email{
        margin-bottom: 1em;
    }
    
</style>