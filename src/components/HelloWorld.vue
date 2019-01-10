<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      Bienvenue sur la postiterie !
    </p>
    <input type="file" @change="previewImage($event.target.name, $event.target.files)" id="avatar" name="avatar" accept="image/png, image/jpeg">
    <div class="frame">
      <div class="container">
        <img id="postit" :src="image" alt="avatar">
      </div>
    </div>
    <button @click="traite">Traiter</button>
    <div id="result"></div>
  </div>
  
</template>
<script src="../src/tracking.js"></script>




<script>

function imagedata_to_image(imagedata) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = imagedata.width;
    canvas.height = imagedata.height;
    ctx.putImageData(imagedata, 0, 0);

    let image = new Image();
    image.src = canvas.toDataURL();
    return image;
}

function crop(x, y, width, height){
          let canvas = document.createElement('canvas');
          let context = canvas.getContext('2d');
          let img = document.getElementById('postit');
          context.drawImage(img, 0, 0 );
          let theData = context.getImageData(x, y, width, height);
          document.getElementById("result").appendChild(imagedata_to_image(theData));
    }


export default {
  name: 'HelloWorld',
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
    previewImage: function(fieldName, file) {
            let imageFile = file[0] 
            let formData = new FormData()
            let imageURL = URL.createObjectURL(imageFile)
            formData.append(fieldName, imageFile)
            this.image=imageURL;
        },
    traite: function () {
      var img = document.getElementById('postit');
      console.log(img)
      var demoContainer = document.querySelector('.container');

      var tracker = new tracking.ColorTracker(['magenta', 'cyan', 'yellow']);

      tracker.on('track', function(event) {
        event.data.forEach(function(rect) {
          window.plot(rect.x, rect.y, rect.width, rect.height, rect.color);
          crop(rect.x,rect.y,rect.width,rect.height);
        });
      });

      tracking.track('#postit', tracker);
      
      window.plot = function(x, y, w, h, color) {
        var rect = document.createElement('div');
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
