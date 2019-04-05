<template>
  <el-button @click="clicked">
    Prendre une photo <i class="material-icons">photo_camera</i>
  </el-button>
</template>

<script>
export default {
  name: "TakePhoto",
  data() {
    return {};
  },
  methods: {
    clicked() {
      this.$emit("clicked");
    }
  }
};
</script>
