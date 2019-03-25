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
    background-color: var(--header-background);
    color: var(--header-color);
    display:flex;
    justify-content: center;
    align-items: center;
    font-size : 1.8em;
    text-align:center;
    font-weight: 900;
    padding : 4px 12px 5px 0px;
}

img{
    width: 3em;
}

</style>