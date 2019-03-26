<template>

    <div class="big-button-container" v-on:click="clicked">
        <label for="photo" class="button-top big-button"><i class="material-icons">photo_camera</i></label>
        <label for="photo" class="button big-button">Prendre une photo</label>
        <!--<input style="display:none" id="photo" type="file" @change="fileUpload($event.target.name, $event.target.files)"  accept="image/*;capture=camera">-->
    </div>
</template>

<script>
export default {
    name: 'TakePhoto',
    data(){
        return {}
    },
    methods: {
        //deals with the clicks
        clicked(){
            this.$emit('clicked');
        }
    }
};

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