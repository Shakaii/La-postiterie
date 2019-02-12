<template>
    <div class="upload-container">
      <div class="input">
        <input placeholder="nom du fichier" type="text" v-model="fileName">
      </div>
      <div class="round-button-container" >
        <button @click="tracking" class="upload button">
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
            fileName: ""
        }
    },
    methods: {
        tracking(){
            this.$parent.fileName = this.fileName;
            this.$parent.tracking();
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

  .upload:active{
      background-color: #F8CDE0;
      box-shadow: 4px 4px 5px #F8CDE0;
  }

  .upload{
      background-color: #FF6B81;
      box-sizing: border-box;
      text-align: center;
      vertical-align: middle;
      padding: 1em;
      cursor: pointer;
      border-style: none;
      border-radius: 20px;
      font-weight: 900;
      transition: 0.3s;
      box-shadow: 5px 5px 5px #656565;
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