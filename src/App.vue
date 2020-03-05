<template lang="pug">
    div#app
        header#nav
            div.hamburger-container
                i(:class="menuClosed?'el-icon-s-unfold':'el-icon-s-fold'" @click="handleClick")
            div.link-container
                a(href="http://mooctest.net" target="_blank")
                    img.logo-lg(src="./assets/logo_200x75_1.png")
            div.link-container
                router-link(to="/") 数据质量测评系统
        div.my-mask(ref="myMask" :style="'transition: opacity '+transitionSecond+'s'" @click="handleClick")
        div.my-menu-container
            my-nav-menu.my-menu(:collapse="menuClosed")
        router-view.center-router-view
</template>

<script>

    import MyNavMenu from "@/components/MyNavMenu";

    export default {
        name: 'App',
        components: {MyNavMenu},
        data() {
            return {
                menuClosed: true,
                transitionSecond: 0.3,
                inTransition: false
            }
        },
        methods: {
            handleClick() {
                if(!this.inTransition) {
                    let myMask = this.$refs['myMask'];
                    if (this.menuClosed) {
                        myMask.style.display = "block";
                        myMask.style.opacity = 0.5;
                    } else {
                        myMask.style.opacity = 0;
                        this.inTransition = true;
                        setTimeout(() => {
                            myMask.style.display = "none";
                            this.inTransition = false;
                        }, 1000 * transitionSecond);
                    }
                    this.menuClosed = !this.menuClosed;
                }
            }
        }
    }
</script>
<style lang="less">
    @navHeight: 50px;
    @menuTotalWidth: 140px;
    @menuMinWidth: 64px;
    @hoverColor: #23527c;

    body {
        margin: 0
    }

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

        .my-mask {
            background-color: #000;
            position: fixed;
            display: none;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
        }

        .center-router-view {
            margin-top: @navHeight;
            margin-left: @menuMinWidth
        }

        @media screen and (max-width: 900px) {
            .center-router-view {
                margin-left: 0
            }

            .el-menu--collapse {
                width: 0;
                * {
                    display: none;
                }
            }
        }

        .my-menu-container {
            position: fixed;
            width: @menuTotalWidth;
            top: @navHeight;
            left: 0;
            bottom: 0;
            text-align: left;
            .my-menu:not(.el-menu--collapse) {
                width: @menuTotalWidth;
            }
        }

        #nav {
            height: @navHeight;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            display: flex;
            background-color: dodgerblue;
            z-index: 1000;

            align-items: center;

            .logo-lg {
                height: @navHeight;
                object-fit: fill;
            }

            .hamburger-container {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                width: 56px;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                &:hover {
                    background-color: @hoverColor;
                }
            }

            .link-container {
                width: 200px;
                height: 100%;
                display: flex;
                align-items: center;

                &:hover {
                    background-color: @hoverColor;
                }

                a {
                    font-weight: bold;
                    color: #fff;
                    font-size: 20px;
                    width: 100%;
                    text-decoration: none;
                }
            }
        ;

        }
    }
</style>
