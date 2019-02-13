<template>
    <div class="big-button-container">
        <div class=" button-top big-button"><i class="material-icons">photo_camera</i></div>
        <span class="button big-button">Prendre une photo</span>
    </div>
</template>

<script>
export default {
    name: 'TakePhoto'
}
</script>

<style scoped>

.button-top{
    padding: 1em;
    padding-top: 0.7em;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    padding-bottom: 0;
    transition: 0.3s;
    cursor: pointer;
    box-shadow: 5px 5px 5px var(--big-button-shadow);
    color: var(--big-button-icon);
}




</style>