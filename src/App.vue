<template lang="pug">
    div#app
        router-view.global-router-view
</template>

<script>

    export default {
        name: 'App'
    }
</script>
<style lang="less">
    body {
        margin: 0
    }

    h1 {
        text-align: center;
    }

    #nprogress .bar {
        background: deeppink !important; //自定义颜色
        height: 5px !important;

    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }
</style>
