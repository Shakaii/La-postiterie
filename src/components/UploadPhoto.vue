<template>
    <div class="upload-container">
      <div class="input">
        <input @change="inputChange" placeholder="email" type="text" v-model="email">
      </div>
      <div class="round-button-container" >
        <button @click="uploadClick" class="round-button button">
            <i class="material-icons">cloud_upload</i>
        </button>
      </div>             
    </div> 
</template>

<script>
export default {
    name: 'UploadPhoto',
    data () {
        return {
            email: ""
        }
    },
    methods: {
        uploadClick(){
            this.$emit('uploadClick');
        },
        inputChange(){
            this.$emit('inputChange', this.email);
        },
    },
    created: function(){

        if (localStorage.getItem('email')){
            this.email = localStorage.getItem('email');
            this.inputChange();
        }
      
    }
}
</script>

<style scoped>
  .upload-container .input{
      width: calc(60% - 1em);
      margin-right: 1em;
      box-sizing: border-box;
  }

  .upload-container .input input{
      background-color: rgba(0,0,0,0);
      border-style:none;
      border-bottom-style:solid;
      border-bottom-color: black;
      width: 100%;
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
</style>