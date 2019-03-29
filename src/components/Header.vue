<template>
    <header>
        <img alt="a postit" src="../assets/postit.png">La Postiterie
    </header>
</template>

<script>
export default {
    name: 'Header'
};
</script>

<style scoped>
header {
    margin-left:25vw;
    width:50vw;
    background-color: var(--header-background);
    color: var(--header-color);
    display:flex;
    justify-content: center;
    align-items: center;
    font-size : 1.8em;
    text-align:center;
    font-weight: 900;
    padding : 4px 12px 5px 0px;
    border-radius : 0 0 15px 15px;
    border-top-style:solid;
}

img{
    width: 3em;
}

@media (max-width: 900px) {
    header {
        width:100vw;
        margin-left:0;
        border-radius : 0 0 0 0;
        border-top-style:none;
    }
}
</style>