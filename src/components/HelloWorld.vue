<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      Bienvenue sur la postiterie !
    </p>
    <input type="file" @change="previewImage($event.target.name, $event.target.files)" id="avatar" name="avatar" accept="image/png, image/jpeg">
    <img :src="image" alt="avatar">
  </div>
</template>

<script>
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
        }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
