<template>

  <div class="container">

    <TakePhoto @fileupload="getImage" />
    <ImportPhoto @fileupload="getImage" />
    <UploadPhoto @uploadClick="tracking" @inputChange="updateEmail" v-if="image && !link" />

    <div class="info" v-if="!image && !link">
      Prenez une photo ou importez en une depuis votre galerie pour générer un schéma
    </div>

    <div class="big-button-container" v-if="link">
      <a class="button big-button" target="_blank" v-bind:href="link">Ouvrir le schéma avec drawIO</a>
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

  export default {

    name: 'Postiterie',
    components: {
      TakePhoto,
      ImportPhoto,
      UploadPhoto
    },
    data() {
      return {
        image: null,
        results: [],
        authorized: false,
        link: null,
        fileName: "",
        pos: [],
        email: ""
      }
    },
    methods: {

      //  updateFileName
      //  update the filename when the value from UploadPhoto's component is updated
      //
      updateEmail: function (newEmail) {
        this.email = newEmail;
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
            
            var myImg = document.getElementById("preview");
            var realWidth = myImg.width;
            var realHeight = myImg.naturalHeight;
            console.log(myImg )
    },

    /*
        FUNCTION tracking
        Track post-its and add them to results[]
        Then, send the file
        TODO : investigate odd behavior --> the function doesn't work if not started from a onclick event (likely due to tracker.on('track', function(event))) )
      */
      tracking: function () {
        let $this = this;
        this.results = [];
        this.temps = []
        this.pos = []
        let tracker = new tracking.ColorTracker(['magenta', 'cyan', 'yellow']);
        tracker.on('track', function (event) {
          let images = event.data;
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
              $this.temps.push(croppedImage.src)
              $this.results.push(croppedImage);
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
            }
          });
        });
        tracking.track('#preview', tracker);
    
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
        xml+=$this.forXmlBackground(el, index)
      })
      xml += '<mxCell id="layerParent" value="Post-its" parent="0"/>'
      // adds the post-its themselves
      this.temps.forEach(function (el, index) {
        xml+=$this.forXmlPostIT(el, index)
      })
      xml+='</root></mxGraphModel>'
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

      // Sign out the user upon button click.
      // not used as of now
      /*handleSignoutClick: function(event) {
        gapi.auth2.getAuthInstance().signOut();
      },*/

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
        form.append('metadata', new Blob([JSON.stringify(metadata)], {
          type: 'application/json'
        }));
        form.append('file', file);

        let xhr = new XMLHttpRequest();
        xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        xhr.responseType = 'json';
        xhr.onload = () => {
          if (xhr.response.id) {
            this.link = 'https://drive.google.com/file/d/' + xhr.response.id + '/view';
            //if email input, send mail else redirect to the file
            if (this.email) {
              this.prepareMail();
            } else {
              window.location.href = this.link;
            }
          }
        };
        xhr.send(form);
      },

      // function prepareMail 
      // TODO
      // no IO
      // call the mail API or our mail server
      prepareMail: function () {
        console.log("prepareMail was fired");
      }
    },
    mounted: function () {
      this.handleClientLoad(); //gapi initialisation
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
</style>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  }

  .info {
    margin-top: 1em;
    text-align: center;
  }
</style>