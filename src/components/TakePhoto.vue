<template>
    <div class="button-container">
        <div class=" button-top button-orange"><i class="material-icons">photo_camera</i></div>
        <span class="button button-orange">Prendre une photo</span>
    </div>
</template>

<script>
export default {
    name: 'TakePhoto'
}
</script>

<style scoped>

.button-container{
    width: 100%;
    margin-top: 1em;
    display: flex;
    flex-direction: column;
    align-items:center;
    user-select: none; 
}

.button-top{
    padding: 1em;
    padding-top: 0.7em;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    padding-bottom: 0;
    transition: 0.3s;
    cursor: pointer;
    box-shadow: 5px 5px 5px #656565;
}

.button-orange{
    background-color: #478BF9;
}

.button-container:active .button-orange{
    box-shadow: 4px 4px 5px #478BF9;
}

.button-container .button{
    width: 80%;
}




</style>