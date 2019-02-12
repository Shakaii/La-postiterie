<template>
    <header>
        <img src="../assets/postit.png">La Postiterie
    </header>
</template>

<script>
export default {
    name: 'Header'
}
</script>

<style scoped>

header {
    display:flex;
    justify-content: center;
    align-items: center;
    font-size : 1.8em;
    text-align:center;
    font-weight: 900;
    background-color: #478BF9;
    padding-right: 12px;
    padding-left: 0px;
    padding-top: 4px;
    padding-bottom: 5px;
    color: rgba(0,0,0,0.6);
    
}

img{
    width: 3em;
}

</style>