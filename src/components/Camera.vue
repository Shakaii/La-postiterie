<template>
  <div class="frame">
    <video
      width="600" height="450" id="video" preload autoplay loop muted 
    />
    <canvas
      width="600" height="450" id="canvas" 
    />
    <div class="actionButtonContainer">
      <button
        @click="cancel" class="cancel"
      >
        <i class="material-icons">cancel</i>
      </button>
      <button
        @click="screenshot" 
        class="takePhoto"
      >
        <i class="material-icons">photo_camera</i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "TakePhoto",
  data() {
    return {};
  },
  mounted() {
    this.takePhoto();
  },
  methods: {
    //emit the file to the main component
    fileUpload(name, file) {
      this.$emit("fileupload", name, file);
    },

    //use tracking js to display the camera and the post it in live
    takePhoto() {
      this.displayVideo = true;
      let video = document.getElementById("video");
      let canvas = document.getElementById("canvas");
      let context = canvas.getContext("2d");
      let tracker = new tracking.ColorTracker(["magenta", "cyan", "yellow"]);
      tracking.track("#video", tracker, { camera: true });
      tracker.on("track", event => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        event.data.forEach(function(rect) {
          if (rect.color === "custom") {
            rect.color = tracker.customColor;
          }
          context.strokeStyle = rect.color;
          context.strokeRect(rect.x + rect.width/2 , rect.y , rect.width/2 , rect.height);
          context.fillStyle = "#fff";
        });
      });
    },

    //onclick on the camera, take a screenshot of it and emit it
    screenshot() {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let video = document.getElementById("video");
      canvas.width = video.width;
      canvas.height = video.height;
      ctx.drawImage(video, 0, 0);
      //closing the camera once the screen is taken
      canvas.toBlob(blob => {
        let img = document.createElement("img");
        img.src = window.URL.createObjectURL(blob);
        this.$emit("screenshotTaken", img);
        this.$emit("closeCamera");
      });
    },

    //cancel the photo taking
    cancel() {
      this.$emit("closeCamera");
    }
  }
};
</script>

<style scoped>
video {
  background-color: black;
}

video,
canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: -3em;
}

.frame {
  padding: 0;
  margin: 0;
  top: 0;
  left: 0;
  position: fixed;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.8);
}

button {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-style: none;
  font-size: 25px;
  margin-bottom: 4px;
  border-radius: 500px;
  color: white;
}

.actionButtonContainer {
  bottom: 0;
  position: fixed;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100vw;
}
</style>
