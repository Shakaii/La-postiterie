<template>
  <el-header>
    <img
      alt="La Postiterie" 
      :src="logoAndTitle"
    />
  </el-header>
</template>

<script>

import logoAndTitle from "../assets/logoandtitle.png";

export default {
  name: "Header",
  data() {
    return {
      logoAndTitle: logoAndTitle
    }
  }
}
</script>

<style scoped>
img {
  height: 50px;
}

.el-header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: rgb(64, 158, 255);
}
</style>
