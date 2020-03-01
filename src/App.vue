<template lang="pug">
    div#app
        header#nav
            div.link-container
                router-link(to="/")
                    img.logo-lg(src="./assets/logo_200x75_1.png")
            div.link-container
                router-link(to="/about") 数据质量测评系统
        router-view
</template>

<style lang="less">
    @navHeight: 50px;

    #nprogress .bar {
        background: deeppink !important; //自定义颜色
        height: 5px !important;

    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: @navHeight;

        #nav {
            height: @navHeight;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            display: flex;
            background-color: dodgerblue;

            align-items: center;

            .logo-lg {
                height: @navHeight;
                object-fit: fill;
            }

            .link-container{
                width: 200px;
                height: 100%;
                display: flex;
                align-items: center;

                &:hover{
                    background-color: #23527c;;
                }

                a {
                    font-weight: bold;
                    color: #fff;
                    font-size: 20px;
                    width: 100%;
                    text-decoration: none;
                }
            };


        }
    }
</style>
