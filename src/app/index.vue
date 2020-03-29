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
    @import "../assets/global";

    // 因为app不是scope，这个可以影响全局
    button.el-button.el-picker-panel__link-btn.el-button--text.el-button--mini {
        display: none;
    }

    body {
        margin: 0;
        min-width: @projectMinWidth;
    }

    h1 {
        text-align: center;
    }

    .el-notification {
        z-index: @elLoadingMaskFullScreenZIndex+1 !important;
    }

    .v-modal {
        z-index: @elLoadingMaskFullScreenZIndex !important;
    }

    .el-popover{
        z-index: @elLoadingMaskFullScreenZIndex+1 !important;
    }

    .el-message-box__wrapper {
        z-index: @elLoadingMaskFullScreenZIndex+1 !important;
    }

    .el-dialog__wrapper {
        z-index: @elLoadingMaskFullScreenZIndex+1 !important;
    }

    .el-message {
        z-index: @elMessageZIndex !important;
    }

    .el-loading-mask {
        z-index: @elLoadingMaskZIndex !important;
    }

    //不留空格，同时拥有类名 且后面的覆盖前面的
    .el-loading-mask.is-fullscreen {
        z-index: @elLoadingMaskFullScreenZIndex !important;
    }

    #nprogress .bar {
        background: deeppink !important; //自定义颜色
        height: 5px !important;
        //避免被盖住
        z-index: @myNavZIndex+1 !important;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }
</style>
