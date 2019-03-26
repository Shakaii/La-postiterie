<template>
    <div v-on:click="screenshot"class="frame">
        <video width="600" height="450"  id="video" preload autoplay loop muted></video>
        <canvas width="600" height="450"   id="canvas"></canvas>
    </div>
</template>

<script>
export default {
    name: 'TakePhoto',
    data(){
        return {
        }
    },
    mounted(){
        this.takePhoto();
    },
    methods: {
        //emit the file to the main component
        fileUpload(name, file){
            this.$emit('fileupload', name, file);
        },

        //use tracking js to display the camera and the post it in live
        takePhoto() {
            this.displayVideo = true;
            let video = document.getElementById('video');
            let canvas = document.getElementById('canvas');
            let context = canvas.getContext('2d');
            let tracker = new tracking.ColorTracker(['magenta', 'cyan', 'yellow']);
            tracking.track('#video', tracker, { camera: true });
            tracker.on('track', function(event) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                event.data.forEach(function(rect) {
                if (rect.color === 'custom') {
                    rect.color = tracker.customColor;
                }
                context.strokeStyle = rect.color;
                context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                context.fillStyle = "#fff";
                });
            });
            // what is this function for ? not defined in trackingjs
            //initGUIControllers(tracker);
        },

        //onclick on the camera, take a screenshot of it and emit it
        screenshot(){
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            let video = document.getElementById('video');
            canvas.width = video.width;
            canvas.height = video.height
            ctx.drawImage(video, 0, 0);
            canvas.toBlob((blob) => {
                let img = document.createElement('img');
                img.src = window.URL.createObjectURL(blob);
                this.$emit('screenshot', img);
            });
        }
    }
};

</script>

<style scoped>

video{
    margin-top: 1em;
    margin-left: -33vw;
    background-color: black;
}

video, canvas {
    position: absolute;
  }

.frame{
    padding: 0;
    margin: 0;
    top: 0;
    left: 0;
    position:fixed;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0,0,0,0.8);  
}




</style>