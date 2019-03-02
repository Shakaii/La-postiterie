<template>

  <div class="container">

    <TakePhoto @fileupload="getImage" />
    <ImportPhoto  @fileupload="getImage" />
    <UploadPhoto @uploadClick="tracking" @inputChange="updateEmail" v-if="image && !link"/>

    <div class="info" v-if="!image && !link">
      Prenez une photo ou importez en une depuis votre galerie pour générer un schéma
    </div>

    <div class="big-button-container" v-if="link">
      <a class="button big-button" target="_blank"  v-bind:href="link">Ouvrir le schéma avec drawIO</a> 
    </div>
    
    <!-- has to be here for tracking-->
    <img style="display:none"  id="preview" :src="image" alt="">
  </div>

</template>
<script src="../src/tracking.js"></script>

<script>

  var authorizeButton;

import TakePhoto from './TakePhoto.vue'
import ImportPhoto from './ImportPhoto.vue'
import UploadPhoto from './UploadPhoto.vue'

export default {

  name: 'Postiterie',
  components: {
    TakePhoto,
    ImportPhoto,
    UploadPhoto
  },
  data () {
    return {
      image: null,
      results: [],
      authorized: false,
      link: null,
      email: ""
    }
  },
  methods: {

    //  updateFileName
    //  update the filename when the value from UploadPhoto's component is updated
    //
    updateEmail: function(newEmail){
      this.email = newEmail;
    },

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
      $this.results = [];

      let tracker = new tracking.ColorTracker(['magenta', 'cyan', 'yellow']);

      tracker.on('track', function(event) {

        let images = event.data;
        const croppedImagePromises = images.map((image)=>{
          return new Promise(function(resolve){
            let croppedImageData = $this.crop(image.x,image.y,image.width,image.height);
            let croppedImage = $this.imageDataToImage(croppedImageData);
            $this.results.push(croppedImage);
            resolve();
          });
        });

        Promise.all(croppedImagePromises).then(()=>{
          if ($this.results.length){
            if ($this.authorized){
              $this.sendFile();
            }
            else{
              Promise.resolve( gapi.auth2.getAuthInstance().signIn())
              .then(() => { $this.sendFile(); });
            }
          }
        });
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
        apiKey: process.env.VUE_APP_API_KEY,
        clientId: process.env.VUE_APP_CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
        scope: 'https://www.googleapis.com/auth/drive'
      }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen($this.updateSigninStatus);

        // Handle the initial sign-in state.
        $this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      }, function(error) {
        console.error(JSON.stringify(error, null, 2));
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
      
      let fileContent = '<?xml version="1.0" encoding="UTF-8"?><mxGraphModel dx="1190" dy="757" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0"><root><mxCell id="0" /><mxCell id="1" parent="0" /></root></mxGraphModel>'
      //let fileContent = this.resultToXML()     // uncomment this line  and remove the one above when resultToXml is ready
      let file = new Blob([fileContent], {type: 'text/xml'});

      let date = new Date()
      date = date.toLocaleDateString("fr-FR");

      //if email is set we can store it in local storage for next time
      if (this.email){
        localStorage.setItem('email', this.email);
      }

      let fileName = "Postiterie " + date; 

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

<style>

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
      text-decoration: none;
  }

  i{
      font-size: 2em!important;
      vertical-align: middle;
  }

  .big-button{
      background-color: var(--big-button-background);
      color: var(--big-button-color);
  }

  .big-button-container:active .big-button{
      box-shadow: 4px 4px 5px var(--big-button-active-shadow);
  }

  .big-button-container .button{
      width: 80%;
  }

  .big-button-container{
      width: 100%;
      margin-top: 1em;
      display: flex;
      flex-direction: column;
      align-items:center;
      user-select: none; 
  }

</style>

<style scoped>

  .container{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
  }

  .info{
    margin-top: 1em;
    text-align:center;
  }

</style>
