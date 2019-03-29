<template>

  <div class="container">

    <Camera v-on:closeCamera="camera = false" v-on:screenshotTaken="getImageFromScreenshot" v-if="camera" />
    <TakePhoto v-on:clicked="camera = true" @fileupload="getImage" />
    <ImportPhoto  @fileupload="getImage" />
    <UploadPhoto  v-on:updateGmail="updateGmail" @uploadClick="tracking" @inputChange="updateEmail" v-if="!progress && image && !link"/>
    <progressBar text-position="middle" text="chargement en cours ..." v-if="progress" size="big" v-bind:val="progressPercentage"></progressBar>

    <div v-if="image && !link && !progress" class="cancel" v-on:click="removeImage">
      <i class="material-icons">cancel_presentation</i>
    </div>

    <div class="info mobile" v-if="!image && !link">
       Importez une photo pour générer un schéma
    </div>

    <div class="info screen" v-if="!image && !link">
      Prenez une photo ou importez en une depuis votre galerie pour générer un schéma
    </div>

    <div class="big-button-container link" v-if="link">
      <a class="button big-button" target="_blank" v-bind:href="link">Ouvrir le schéma avec drawIO<br><i class="material-icons">open_in_new</i></a>
    </div>

    <!-- has to be here for tracking-->
    <img style="display:none" id="preview" :src="image" alt="">
  </div>

</template>
<script src="../src/tracking.js"></script>

<script>
  var authorizeButton;

  import TakePhoto from './TakePhoto.vue';
  import ImportPhoto from './ImportPhoto.vue';
  import UploadPhoto from './UploadPhoto.vue';
  import Camera from './Camera.vue';
  import { Email } from '../smtp.js';
  import ProgressBar from 'vue-simple-progress';

  export default {
    name: 'Postiterie',
    components: {
      TakePhoto,
      ImportPhoto,
      UploadPhoto,
      Camera,
      ProgressBar
    },
    data () {
      return {
        image: null,
        results: [],
        authorized: false,
        link: null,
        directLink: null,
        email: "",
        camera : false,
        useGmail: true,
        progressIndex: 0,
        progress: false,
        progressPercentage: 0,
        isEmailValid: false
      }
    },

    created: function(){
      if (localStorage.getItem('image')){
        this.image = localStorage.getItem('image');
      }
    },

    methods: {

      //  updateEmail
      //  update the filename when the value from UploadPhoto's component is updated
      updateEmail: function (newEmail, isEmailValid) {
        this.email = newEmail;
        this.isEmailValid = isEmailValid;
      },

      /* 
        FUNCTION imageDataToImage
        transform an imageData to an image
        IN : imageData
        OUT : image
      */
      imageDataToImage: function (imagedata) {
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
      
      //increment and update de progressBar
      incrementProgressBar: function(){
          this.progressIndex ++;
          this.progressPercentage = (this.progressIndex * 100) / this.progressMax;
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
        this.saveImage();
      },

      //remove the image from the localStorage
      removeImage: function(){
          this.image = null;
          localStorage.removeItem("image");
      },

      /*
          FUNCTION tracking
          Track post-its and add them to results[]
          Then, send the file
          TODO : investigate odd behavior --> the function doesn't work if not started from a onclick event (likely due to tracker.on('track', function(event))) )
      */
      tracking: function () {
        if(this.useGmail == false && this.email.length >= 1 && !this.isEmailValid){
          this.displayError("Oups, votre email n'est pas valide, corrigez la et réessayez.");
        }
        else{

          let $this = this;
          this.results = [];
          this.temps = [];
          this.pos = [];
          this.progress = true;
          this.progressIndex = 0;
          this.progressPercentage = 0;
            
          let tracker = new tracking.ColorTracker(['magenta', 'cyan', 'yellow']);
          tracker.on('track', function (event) {
            let images = event.data;   
            $this.progressMax = images.length + 2;
            $this.progressPercentage = ($this.progressIndex * 100) / $this.progressMax;
            $this.incrementProgressBar();

            const croppedImagePromises = images.map((image) => {
              return new Promise(function (resolve) {
                let colorHexa = $this.colorToHexa(image.color);
                let croppedImageData = $this.crop(image.x, image.y, image.width, image.height);
                $this.pos.push(new Object({
                  x: image.x,
                  y: image.y,
                  width: image.width,
                  height: image.height, 
                  color: colorHexa
                }))
                let croppedImage = $this.imageDataToImage(croppedImageData);
                $this.temps.push(croppedImage.src);
                $this.results.push(croppedImage);
                $this.incrementProgressBar();

                resolve();
              });
            });
            Promise.all(croppedImagePromises).then(() => {
              if ($this.results.length) {
                if ($this.authorized) {
                  $this.sendFile();
                } else {
                  Promise.resolve(gapi.auth2.getAuthInstance().signIn())
                    .then(() => {
                      $this.sendFile();
                    });
                }
              }else{
                $this.displayError("Oups! Aucun post-it n'a été détecté dans cette image. Veuillez réessayer si c'est anormal.");
                $this.progress = false;
                $this.image = null;
              }
            });
          });
          tracking.track('#preview', tracker);
        }
      },

      // function colorToHexa
      // param : the color detected by the tracker
      // return : the hexadecimal code of the color
      colorToHexa: function(color){
        if(color=="yellow"){
          return "#ffff00";
        }
        if(color=="magenta"){
          return "#ff0066";
        }
        if(color=="cyan"){
          return "#00ccff";
        }
      },


      // function resultToXML
      // TODO
      // return the XML from the result array[];
      resultToXML: function(){
        let $this = this;
        let xml = process.env.VUE_APP_XML_ENTETE;
        // adds the background shapes of the post its
        this.temps.forEach(function (el, index) {
          xml+=$this.forXmlBackground(el, index);
        })
        xml += '<mxCell id="layerParent" value="Post-its" parent="0"/>';
        // adds the post-its themselves
        this.temps.forEach(function (el, index) {
          xml+=$this.forXmlPostIT(el, index);
        })
        xml+='</root></mxGraphModel>';
        return xml;
      },

      // creates the xml code for the picture of the post it
      // params : index -> the index of the picture
      // el -> the picture
      // returns : the xml code
      forXmlPostIT(el, index) {
      let base = el.replace(";base64", "");
      return `<mxCell id="xVlBypw9ISABlRlfdyYR-${index}" value="" 
style="shape=image;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;aspect=fixed;imageAspect=0;image=${base};"
            vertex="1" parent="layerParent">
      <mxGeometry x="${this.pos[index].x}" y="${this.pos[index].y}" width="${this.pos[index].width}" height="${this.pos[index].height}" as="geometry" /></mxCell>`
    },

      // creates the xml code for the shape of the post it in the background layer
      // params : index -> the index of the picture
      // el -> the picture
      // returns : the xml code
      forXmlBackground(el, index) {
      let base = el.replace(";base64", "");
      return `<mxCell id="xVlBypw9ISABlRlfdyYR-${index}-rec" value=""
      style="shape=rectangle;fillColor=${this.pos[index].color};"
             vertex="1" parent="1">
      <mxGeometry x="${this.pos[index].x}" y="${this.pos[index].y}" width="${this.pos[index].width}" height="${this.pos[index].height}" as="geometry" /></mxCell>`
    },

      ///////////////////////////////
      //  GOOGLE DRIVE FUNCTIONS   //
      ///////////////////////////////

      //On load, called to load the auth2 library and API client library.
      handleClientLoad: function () {
        return gapi.load('client:auth2', this.initClient);
      },

      //Initializes the API client library and sets up sign-in state listeners.
      initClient: function () {

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
        }, function (error) {
          console.error(JSON.stringify(error, null, 2));
        });
      },

      // Called when the signed in status changes, to update the UI
      //  appropriately. After a sign-in, the API is called.
      updateSigninStatus: function (isSignedIn) {
        this.authorized = isSignedIn;
      },

      // Sign in the user upon button click.
      handleAuth: function () {
        gapi.auth2.getAuthInstance().signIn();
      },

      //on emit update useGmail
      updateGmail: function(useGmail){
        this.useGmail = useGmail;
      },

      saveImage: function(){
        if (this.image){
          localStorage.setItem('image',this.image);
        }
      },

      //upload the file to google drive
      sendFile: function () {
        let $this = this;
        let fileContent = this.resultToXML()
        let file = new Blob([fileContent], {
          type: 'text/xml'
        });

        let date = new Date();
        date = date.toLocaleDateString("fr-FR");

        //if email is set we can store it in local storage for next time
        if (this.email) {
          localStorage.setItem('email', this.email);
        }

        const fileName = `Postiterie ${date}`;

        let metadata = {
          'name': fileName, // Filename at Google Drive
          'mimeType': 'text/xml', // mimeType at Google Drive
          'parents': ['root'], // Folder ID at Google Drive
        };

        let accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
        let form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
        form.append('file', file);

        this.incrementProgressBar();

        let xhr = new XMLHttpRequest();
        xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        xhr.responseType = 'json';
        xhr.onload = () => {
          if (xhr.response.id){

            this.incrementProgressBar();
            
            //the link to the file on google drive
            this.link = 'https://drive.google.com/file/d/' + xhr.response.id + '/view';
            this.progress = false;

            //the link to the file on drawIO (if already allowed on google drive)
            let profileId = gapi.auth2.getAuthInstance().currentUser.get().getId();

            //making sure nothing breaks if chain does
            if (profileId){
              this.directLink = `https://www.draw.io/?state={"ids":["${xhr.response.id}"],"action":"open","userId":"${profileId}"}#G${xhr.response.id}`;
            }
            else {
              this.directLink = "";
            }

            //if the user chose to use his gmail email, reset email to his gmail email
            if(this.useGmail){
              let gmail = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().U3;

              //small regex to be sure we got an email
              const mailregex = /\S+@\S+\.\S+/;

              //if chain did not broke
              if (mailregex.test(gmail)){
                this.email = gmail;
              } 
              else {
                this.displayError("Oups! Nous n'avons pas pu récupérer l'adresse mail associée à votre compte google :/");
              }
            }
            //if email is set, send mail else redirect to the file
            if (this.email){
              this.prepareMail();
            }
            else{
              window.location.href = this.link;
            }
            localStorage.removeItem("image");
          }
        }
        xhr.send(form);
      },

      //set the received image
      getImageFromScreenshot: function(image){
        this.image = image.src; 
        this.saveImage();
      },

      //use vue-toasted to display an error
      displayError: function(message){
        this.$toasted.show(message, {
          theme: "bubble",
          position: "top-left",
          duration : 10000,
          icon: 'error'
        });
      },

      // function prepareMail 
      // TODO
      // no IO
      // call the mail API or our mail server
      prepareMail: function(){

        let body = "";
        if (this.directLink){
          body = `Voici un lien vers le schéma que vous venez de générer ${this.link} Vous n'avez plus qu'à ouvrir le schéma avec drawIO. Si vous l'avez déjà fait, utilisez plutôt ce lien : ${this.directLink}`;
        } 
        else{
          body = `Voici un lien vers le schéma que vous venez de générer ${this.link} Vous n'avez plus qu'à ouvrir le schéma avec drawIO.`;
        }

        //  Using smtpjs to send mail
        // TODO : smtpjs can encrypt credentiel and return a token but we need to pass a domain name so come back here for deplyment
        Email.send({
          Host : "smtp.gmail.com",
          Username : process.env.VUE_APP_SMTP_EMAIL,
          Password : process.env.VUE_APP_SMTP_PASSWORD,
          To : this.email,
          From : process.env.VUE_APP_SMTP_EMAIL,
          Subject : "Nouveau schéma généré",
          Body : body
        }).catch(e => {
          this.displayError("Oups! Il y a eu une erreur lors de l'envoi du mail :/");
        });   
      }
    },

    mounted: function(){
      //gapi initialisation
      this.handleClientLoad();
    }
  }
</script>

<style>
  .button {
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

  i {
    font-size: 2em !important;
    vertical-align: middle;
  }

  .big-button {
    background-color: var(--big-button-background);
    color: var(--big-button-color);
  }

  .big-button-container:active .big-button {
    box-shadow: 4px 4px 5px var(--big-button-active-shadow);
  }

  .big-button-container .button {
    width: 80%;
  }

  .big-button-container {
    width: 100%;
    margin-top: 1em;
    display: flex;
    flex-direction: column;
    align-items: center;
    user-select: none;
  }

  .vue-simple-progress{
    margin-top: 1em;
    width: 80vw;
  }

  .vue-simple-progress-text{
    font-family: 'Fira Sans', sans-serif;
    font-size: 1em!important;
  }

  @media (min-width: 900px) {
    .vue-simple-progress{
      width: 40vw;
    }
  }
</style>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    width:50.8vw;
    margin-left:25vw;
  }

  .info {
    margin-top: 1em;
    text-align: center;
  }

  .link i{
    color: var(--small-button-icon);
  }

  .screen{
    display:none;
  }

  .cancel{
    cursor:pointer;
  }

  @media (max-width: 900px) {
    .container {
        width:100vw;
        margin-left:0;
    }
    .mobile{
      display:none;
    }
    .screen{
      display:initial;
    }
  }
</style>