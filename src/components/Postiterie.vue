<template>
  <div>
    <h1>{{ msg }}</h1>
    <input type="file" @change="previewImage($event.target.name, $event.target.files)" accept="image/png, image/jpeg">
    <div class="frame">
      <div class="container">
        <img id="preview" :src="image" alt="">
      </div>
    </div>
    <button @click="tracking">Traiter</button>
    <div id="result"></div>
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
  props: {
    msg: String,
  },
  data () {
    return {
      image: null
    }
  },
  methods: {



    onFileSelected(event) {console.log(event)},


    /*
      FUNCTION previewImage
      preview the uploaded image
      IN : fieldName : the fieldName ;)
           file : the image
    */
    previewImage: function(fieldName, file) {
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
      let img = document.getElementById('preview');
      var demoContainer = document.querySelector('.container');

      let tracker = new tracking.ColorTracker(['magenta', 'cyan', 'yellow']);

      tracker.on('track', function(event) {
        event.data.forEach(function(rect) {
          window.plot(rect.x, rect.y, rect.width, rect.height, rect.color);
          let croppedImageData = crop(rect.x,rect.y,rect.width,rect.height);
          let croppedImage = imageDataToImage(croppedImageData);
          document.getElementById("result").appendChild(croppedImage);
        });
      });

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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.rect {
    width: 80px;
    height: 80px;
    position: absolute;
    left: -1000px;
    top: -1000px;
  }
</style>
