<template>
    <div class="small-button-container">
      <label for="file" class="button small-button"><span>Importer une photo</span> <i class="material-icons">photo_library</i></label>
      <input style="display:none" id="file" type="file" @change="fileUpload($event.target.name, $event.target.files)"  accept="image/*;capture=camera">
    </div>
</template>

<script>
export default {
    name: 'ImportPhoto',
    methods: {
        fileUpload(name, file){
            this.$emit('fileupload', name, file);
        }
    }
};
</script>

<style scoped>

.small-button-container{
    width: 100%;
    margin-top: 1em;
    display: flex;
    flex-direction: row;
    align-items:center;
    justify-content:center;
    user-select: none; 
}

.small-button-container:active .small-button{
    box-shadow: 4px 4px 5px var(--small-button-active-shadow);
}

.small-button-container .button{
    width: 80%;
}

.small-button-container .button{
    vertical-align: middle;
}

.small-button{
    background-color: var(--small-button-background);
    color: var(--small-button-color);
    padding: 0.3em;
}

.small-button i{
    color: var(--small-button-icon);
    margin-left:7px;
}

@media (min-width: 900px) {
    .small-button{
        padding: 1em;
    }
}

</style>