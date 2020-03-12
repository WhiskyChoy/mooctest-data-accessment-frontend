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
    @import "assets/global";

    body {
        margin: 0;
        min-width: @projectMinWidth;
    }

    h1 {
        text-align: center;
    }

    .el-loading-mask {
        z-index: @basicZIndex+1 !important;
    }

    //不留空格，同时拥有类名 且后面的覆盖前面的
    .el-loading-mask.is-fullscreen {
        z-index: @basicZIndex+3 !important;
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
