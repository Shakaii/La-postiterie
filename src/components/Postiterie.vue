<template>
  <div>
    <div class="control">
      <label  for="file" class="label-input"><span class="button">Choisir une image</span></label>
      <input id="file" type="file" class="button-input" @change="previewImage($event.target.name, $event.target.files)" accept="image/png, image/jpeg">
      <span id="startTracking"  class="button" v-bind:class="{faded: isNoImage}" @click="tracking">Traiter</span><br>
    </div>
    <div class="frame">
      <div class="container">
        <img id="preview" :src="image" alt="">
      </div>
    </div>
    <div id="result-hr" v-bind:class="{hidden: isNoResult}">
      <div class="hr">
        <span class="hr-img">.</span>
        <span>Résultat</span>
        <span class="hr-img">.</span>
      </div>
    </div>
    <div id="result">
        <li v-for="image in results">
          <img v-bind:src='image.currentSrc' >
        </li>
    </div>
  </div>
</template>
<script src="../src/tracking.js"></script>

<script>

/* 
  FUNCTION imageDataToImage
  transform an imageData to an image
  IN : imageData
  OUT : image
*/
function imageDataToImage(imagedata) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = imagedata.width;
    canvas.height = imagedata.height;
    ctx.putImageData(imagedata, 0, 0);
    let image = new Image();
    image.src = canvas.toDataURL();
    return image;
}

/*
  FUNCTION crop
  Crop an image using the coordinates and return its imageData
  IN : x, y (numbers) coordinates from which to start croping
       width, height (numbers) length to crop
  OUT: imageData
*/
function crop(x, y, width, height){
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  let img = document.getElementById('preview');
  canvas.width = img.width;
  canvas.height = img.height;
  context.drawImage(img, 0, 0);
  return context.getImageData(x, y, width, height);
}

export default {
  name: 'Postiterie',
  data () {
    return {
      image: null,
      isNoImage: true,
      isNoResult: true,
      results: []
    }
  },
  methods: {

    /*
      FUNCTION previewImage
      preview the uploaded image (and activate the button to track)
      IN : fieldName : the fieldName ;)
           file : the image
    */
    previewImage: function(fieldName, file) {
            this.isNoImage = false;
            let imageFile = file[0] 
            let formData = new FormData()
            let imageURL = URL.createObjectURL(imageFile)
            formData.append(fieldName, imageFile)
            this.image=imageURL;
    },

    /*
      FUNCTION tracking
      Track post-its and draw a square around them
    */
    tracking: function () {
      
      let $this = this;
      let img = document.getElementById('preview');
      let demoContainer = document.querySelector('.container');
      let tracker = new tracking.ColorTracker(['magenta', 'cyan', 'yellow']);

      tracker.on('track', function(event) {
        event.data.forEach(function(rect) {
          window.plot(rect.x, rect.y, rect.width, rect.height, rect.color);
          let croppedImageData = crop(rect.x,rect.y,rect.width,rect.height);
          let croppedImage = imageDataToImage(croppedImageData);
          $this.results.push(croppedImage);
        });
      });

      this.isNoResult = false;

      tracking.track('#preview', tracker);
      
      //draw a square on the image (useless but looks good)
      window.plot = function(x, y, w, h, color) {
        let rect = document.createElement('div');
        document.querySelector('.container').appendChild(rect);
        rect.classList.add('rect');
        rect.style.border = '2px solid ' + color;
        rect.style.width = w + 'px';
        rect.style.height = h + 'px';
        rect.style.left = (img.offsetLeft + x) + 'px';
        rect.style.top = (img.offsetTop + y) + 'px';
      };
    }
  }
}
</script>


<style>
.rect {
    width: 80px;
    height: 80px;
    position: absolute;
    left: -1000px;
    top: -1000px;
}
</style>

<style scoped>

.faded {
    opacity: 0.5;
}

.hidden {
    display: none;
}

.control {
    display: flex;
    justify-content: center;
    align-items: center;
}

.button-input {
    display: none;
}

.button {
    margin: 1em;
    background-image: url("../assets/nav.jpg");
    cursor: pointer;
    background-color: #7a9cd3;
    border: none;
    color: white;
    border-top-left-radius: 15px;
    border-bottom-right-radius: 15px;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    font-size: 1em;
    border-style: outset;
    border-color: #879ec4;
    color: black;
    box-sizing: border-box;
}

.button:active {
    border-color: #879ec4;
    border-style: inset;
}

.hr {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin: 2em;
}

.hr-img {
    border-radius: 1em;
    background-image: url("../assets/nav.jpg");
    width: 40%;
    height: 100%;
    color: rgba(0, 0, 0, 0)
}
</style>
