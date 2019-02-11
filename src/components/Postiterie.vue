<template>

  <div class="container">
    <div class="button-container">
      <div class=" button-top button-orange"><i class="material-icons">photo_camera</i></div>
      <span class="button button-orange">Prendre une photo</span>
    </div>

    <div class="small-button-container">
      <label for="file" class="button button-green">Importer une photo <i class="material-icons">photo_library</i></label>
      <input style="display:none" id="file" type="file" @change="getImage($event.target.name, $event.target.files)" accept="image/png, image/jpeg">
    </div>

    <div class="upload-container" v-if="image && !link">
      <div class="input">
        <input placeholder="nom du fichier" type="text" v-model="fileName">
      </div>
      <div class="round-button_container" >
        <button @click="tracking" class="upload button"><i class="material-icons">cloud_upload</i></button>
      </div>             
    </div> 

    <div class="info" v-else-if="!link">
      Prenez une photo ou importez en une depuis votre galerie pour générer un schéma
    </div>

    <div class="button-container" v-if="link">
      <a class="button button-orange" target="_blank"  v-bind:href="link">Ouvrir le schéma avec drawIO</a> 
    </div>
    
    <!-- has to be here for tracking-->
    <img style="display:none"  id="preview" :src="image" alt="">
  </div>

</template>
<script src="../src/tracking.js"></script>

<script>

  var authorizeButton;

export default {

  name: 'Postiterie',
  data () {
    return {
      image: null,
      results: [],
      authorized: false,
      trackingFinished: false,
      trackingFinishedWithNoResult: false,
      fileName: "",
      CLIENT_ID: '222333408772-7babrj6q1uronhdntc2a5fj6lv6m5cff.apps.googleusercontent.com',
      API_KEY: 'AIzaSyCp7-1ieE8KGorrOce7toVfdBriDXss-sM',
      DISCOVERY_DOCS: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
      SCOPES: 'https://www.googleapis.com/auth/drive',
      link: null
    }
  },
  methods: {

    /* 
      FUNCTION imageDataToImage
      transform an imageData to an image
      IN : imageData
      OUT : image
    */
    imageDataToImage: function(imagedata) {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = imagedata.width;
        canvas.height = imagedata.height;
        ctx.putImageData(imagedata, 0, 0);
        let image = new Image();
        image.src = canvas.toDataURL();
        return image;
    },

    /*
      FUNCTION crop
      Crop an image using the coordinates and return its imageData
      IN : x, y (numbers) coordinates from which to start croping
           width, height (numbers) length to crop
      OUT: imageData
    */
    crop: function( x, y, width, height){
      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');
      let img = document.getElementById('preview');
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
      return context.getImageData(x, y, width, height);
    },

    /*
      FUNCTION getImage
      get the uploaded image and start the tracking
      IN : fieldName : the fieldName ;)
           file : the image
    */
    getImage: function(fieldName, file) {
            this.link = null;
            let imageFile = file[0];
            let formData = new FormData();
            let imageURL = URL.createObjectURL(imageFile);
            formData.append(fieldName, imageFile);
            this.image=imageURL;
    },

    /*
      FUNCTION tracking
      Track post-its and add them to results[]
      Then, send the file
      TODO : investigate odd behavior --> the function doesn't work if not started from a onclick event (likely due to tracker.on('track', function(event))) )
    */
    tracking: function () {
      
      let $this = this;
      $this.trackingFinished = false;
      $this.trackingFinishedWithNoResult = false;

      let tracker = new tracking.ColorTracker(['magenta', 'cyan', 'yellow']);

      tracker.on('track', function(event) {
        
        event.data.forEach(function(rect) {
          
          let croppedImageData = $this.crop(rect.x,rect.y,rect.width,rect.height);
          let croppedImage = $this.imageDataToImage(croppedImageData);
          $this.results.push(croppedImage);

        });

        setTimeout(function(){
          if ($this.results.length){
            if ($this.authorized){
              $this.sendFile();
            }else{
              Promise.resolve( gapi.auth2.getAuthInstance().signIn())
              .then(() => { $this.sendFile(); });
              }
            }
          
          else $this.trackingFinishedWithNoResult = true;

        },3000);

      });

      tracking.track('#preview', tracker);
    },



    // function resultToXML
    // TODO
    // return the XML from the result array[];
    resultToXML: function(){
      let xml = "";
    
      return xml;
    },

    ///////////////////////////////
    //  GOOGLE DRIVE FUNCTIONS   //
    ///////////////////////////////

    //On load, called to load the auth2 library and API client library.
    handleClientLoad: function() {
      return gapi.load('client:auth2', this.initClient);
    },

    
    //Initializes the API client library and sets up sign-in state listeners.
    initClient: function() {

      authorizeButton = document.getElementById('authorize_button');
      let $this = this;

      gapi.client.init({
        apiKey: this.API_KEY,
        clientId: this.CLIENT_ID,
        discoveryDocs: this.DISCOVERY_DOCS,
        scope: this.SCOPES
      }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen($this.updateSigninStatus);

        // Handle the initial sign-in state.
        $this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      }, function(error) {
        console.log(JSON.stringify(error, null, 2));
      });
    },

    // Called when the signed in status changes, to update the UI
    //  appropriately. After a sign-in, the API is called.
    updateSigninStatus: function(isSignedIn) {
        this.authorized = isSignedIn;
    }, 

    // Sign in the user upon button click.
    handleAuth: function() {
      gapi.auth2.getAuthInstance().signIn();
    },

    // Sign out the user upon button click.
    // not used as of now
    /*handleSignoutClick: function(event) {
      gapi.auth2.getAuthInstance().signOut();
    },*/

    sendFile: function(){
      let $this = this;
      console.log("sending File");
      let fileContent = '<?xml version="1.0" encoding="UTF-8"?><mxGraphModel dx="1190" dy="757" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0"><root><mxCell id="0" /><mxCell id="1" parent="0" /></root></mxGraphModel>'
      //let fileContent = this.resultToXML()
      let file = new Blob([fileContent], {type: 'text/xml'});

      let fileName ="";

      if (this.fileName){
        fileName = this.fileName
      }
      else fileName = "La Postiterie - schéma sans nom"

      let metadata = {
          'name': fileName, // Filename at Google Drive
          'mimeType': 'text/xml', // mimeType at Google Drive
          'parents': ['root'], // Folder ID at Google Drive
      };

      let accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
      let form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
      form.append('file', file);

      let xhr = new XMLHttpRequest();
      xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
      xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.response.id){
          $this.link = 'https://drive.google.com/file/d/' + xhr.response.id + '/view';
        }
      };
      xhr.send(form);
    }
  },
  mounted: function(){
    this.handleClientLoad(); //gapi initialisation
  }
}
</script>

<style scoped>
  span{
      font-weight: 100;
      width: 20%;
      text-align: center;
  }

  .button-container{
      width: 100%;
      margin-top: 1em;
      display: flex;
      flex-direction: column;
      align-items:center;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently*/
  }

  .small-button-container{
      width: 100%;
      margin-top: 1em;
      display: flex;
      flex-direction: row;
      align-items:center;
      justify-content:center;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently*/
  }

  .small-button-container .button{
      vertical-align: middle;
  }

  i{
      color:rgba(0,0,0,0.5);
      font-size: 2em!important;
      vertical-align: middle;
  }

  .button-top{
      padding: 1em;
      padding-top: 0.7em;
      border-top-left-radius: 50px;
      border-top-right-radius: 50px;
      padding-bottom: 0;
      transition: 0.3s;
      cursor: pointer;
      box-shadow: 5px 5px 5px #656565;
  }

  .button-container .button{
      width: 80%;
  }

  .small-button-container .button{
      width: 80%;
  }

  .container{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
  }

  .button-orange{
      background-color: #478BF9;
  }

  .button-container:active .button-orange{
      box-shadow: 4px 4px 5px #478BF9;
  }

  .small-button-container:active .button-green{
      background-color: #6ED2D0;
      box-shadow: 4px 4px 5px #6ED2D0;
  }

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

  .button{
      box-sizing: border-box;
      text-align: center;
      vertical-align: middle;
      padding: 1.5em;
      cursor: pointer;
      border-style: none;
      border-radius: 4px;
      font-weight: 900;
      transition: 0.3s;
      box-shadow: 5px 5px 5px #656565;
      color: rgba(0,0,0,0.6);
      text-decoration: none;
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
      -webkit-touch-callout: none; /* iOS Safari */   
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently*/
  }

  .info{
    margin-top: 1em;
    text-align:center;
  }

  .open-link{
    margin-top: 1em;
  }

  .margin-top{
    margin-top: 1em;
  }

    .button-green{
      background-color: #6ED2D0;
      padding: 0.3em;
      color: rgba(0,0,0,0.6);
  }

</style>
