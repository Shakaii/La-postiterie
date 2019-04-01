<template>
    <div>
        <el-button>
            <label for="file"> Importer une photo <i class="material-icons">photo_library</i></label>
        </el-button>
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
    label{
        width:100%;
        height:100%;
        cursor: pointer;
    }
</style>