<template>
    <div class="upload-container">
      <div class="input">
          <div class="checkboxContainer">
            <input id="checkbox" type="checkbox" v-model="useGmail" v-on:change="updateGmail">
            <label for="checkbox">Envoyer le lien sur mon adresse gmail</label><br><br>
        </div>
        <input v-bind:class="{ formValid: (isEmailValid && email.length >= 1), formInvalid: (!isEmailValid && email.length >= 1)}" @change="checkEmail" v-if="useGmail == false" id="email" placeholder="email" type="text" v-model="email">
      </div>
      <div class="round-button-container" >
        <button @click="uploadClick" class="round-button button">
            <i class="material-icons">cloud_upload</i>
        </button>
        <br><br>Exporter sur google drive
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

    label{
        margin-left:1em;
    }

    .checkboxContainer{
        display:flex;
        flex-direction:row;
        justify-content: flex-start;
    }

    .upload-container .input{
        width: calc(60% - 1em);
        margin-right: 1em;
        box-sizing: border-box;
    }


    .upload-container .input #email{
        margin-top: 1em;
        background-color: rgba(0,0,0,0);
        border-style:none;
        border-bottom-style:solid;
        border-bottom-color: black;
        width: 100%;
        font-family: 'Fira Sans', sans-serif;
    }

    .formInvalid{
        border-bottom-color: red!important;
    }

    .formValid{
        border-bottom-color:green!important;
    }

    .upload-container .input input::placeholder{
        font-weight: 100;
        text-transform: uppercase
    }

    .round-button-container{
        width: 20%;
        text-align: center;
    }

    .round-button:active{
        box-shadow: 4px 4px 5px var(--round-button-active-shadow);
    }

    .round-button{
        background-color: var(--round-button-background);       
        box-sizing: border-box;
        text-align: center;
        vertical-align: middle;
        padding: 1em;
        cursor: pointer;
        border-style: none;
        border-radius: 20px;
        font-weight: 900;
        transition: 0.3s;
        box-shadow: 5px 5px 5px var(--round-button-shadow);
        color: var(--round-button-color);
    }

    .round-button i{
        color: var(--round-button-icon);
    }

    .upload-container{
        width: 100%;
        margin-top: 1em;
        display: flex;
        flex-direction: row;
        align-items:center;
        justify-content:center;
        user-select: none;
    }

    @media (min-width: 900px) {
       .upload-container .input{
            width: initial;
        }
        .upload-container {
            flex-direction: column;
            padding:1em;
        }
        .checkboxContainer{
            margin-bottom:1em;
        }
        #email{
            margin-bottom: 1em;
        }
        .round-button{
            padding: 2em 3em 2em 3em;
        }
    }
</style>