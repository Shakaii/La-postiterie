<template>
  <el-header>
    <img
      alt="a postit" 
      src="../assets/logoandtitle.png" 
    />
  </el-header>
</template>

<script>
export default {
  name: "Header"
};
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
