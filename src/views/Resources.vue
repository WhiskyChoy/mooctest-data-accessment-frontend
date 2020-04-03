<template lang="pug">
    div#resources
        header.nav
            div.left-container
                div.hamburger-container(@click="handleClick")
                    i(:class="menuClosed?'el-icon-s-unfold':'el-icon-s-fold'")
                div.link-container
                    a(href="http://mooctest.net" target="_blank")
                        img.logo-lg(src="@/assets/logo_200x75_1.png")
                div.link-container.link-self
                    router-link(to="/") 数据质量测评系统
            div.right-container
                el-dropdown(@command="handleCommand").avatar
                    span {{avatarText}}
                    el-dropdown-menu(slot="dropdown")
                        el-dropdown-item(command="logout") 登出
        div.my-mask(ref="myMask" :style="'transition: opacity '+transitionSecond+'s'" @click="handleClick")
        div.my-menu-container
            my-nav-menu.my-menu(:collapse="menuClosed")
        el-scrollbar
            router-view.center-router-view
</template>

<script>
    import MyNavMenu from "@/components/MyNavMenu";
    import {getLocalUser, logout} from "@/utils/userUtil";

    export default {
        name: 'Resources',
        components: {MyNavMenu},
        computed: {
            avatarText() {
                const user = getLocalUser();
                if (user && user.username) {
                    return user.username.slice(0, 1);
                }
                return '';
            }
        },
        data() {
            return {
                menuClosed: true,
                transitionSecond: 0.3,
                inTransition: false
            }
        },
        methods: {
            handleClick() {
                if (!this.inTransition) {
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
                        }, 1000 * this.transitionSecond);
                    }
                    this.menuClosed = !this.menuClosed;
                }
            },
            handleLogout() {
                logout();
                this.$router.push('/login');
            },
            handleCommand(command) {
                if (command === 'logout') {
                    this.handleLogout();
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/global";

    #resources {

        overflow-y: hidden;

        .my-mask {
            background-color: #000;
            position: fixed;
            display: none;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: @myMaskZIndex;
        }

        /*/deep/ .el-table__body-wrapper {*/

        /*&::-webkit-scrollbar {*/
        /*width: 8px;*/
        /*height: 8px;*/
        /*background-color: #fff;*/
        /*}*/

        /*&::-webkit-scrollbar-thumb {*/
        /*border-radius: 5px;*/
        /*background-color: rgba(0, 0, 0, .1)*/
        /*}*/
        /*}*/

        /deep/ .my-table-container {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            .my-writ-or-task-table {
                min-height: 450px;
                max-width: 1200px !important;
                margin-bottom: 1rem;
            }
        }

        @media screen and (max-width: 1000px), screen and (orientation: portrait) {
            /deep/ .my-writ-or-task-table .el-tag span {
                display: none;
            }

            /deep/ .my-writ-or-task-table .my-button span {
                display: none;
            }
        }

        .el-scrollbar {
            position: fixed;
            top: @navHeight;
            left: @menuMinWidth;
            right: 0;
            bottom: 0;
            //不能加height: 100%，否则会探测不到底部
        }

        .el-scrollbar /deep/ .el-scrollbar__wrap {
            overflow-y: auto;
            overflow-x: hidden;
        }

        //这里直接给thumb没有用，z-index只管同级的
        .el-scrollbar /deep/ .el-scrollbar__bar.is-vertical {
            z-index: @scrollbarThumbZIndex;
        }

        /deep/ .center-view-container {
            display: flex;
            flex-direction: column;
        }

        /deep/ .center-view-header {
            background-color: #fff;
            text-align: center;
            position: absolute;
            width: 100%;
            z-index: @centerHeaderZIndex;
            min-width: @projectMinWidth;
        }

        /deep/ .center-view-body {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: @navHeight+@reportHeaderMargin*2;
            min-width: @projectMinWidth;
        }

        /deep/ .center-view-title {
            margin-top: @reportHeaderMargin;
            margin-bottom: @reportHeaderMargin;
        }

        @media screen and (max-width: @hideMenuScreenWidth), screen and (orientation: portrait) {
            /deep/ .el-scrollbar {
                left: 0
            }

            /deep/ .el-menu--collapse {
                width: 0;
                * {
                    display: none;
                }
            }

            .link-self {
                display: none !important;
            }
        }

        .my-menu-container {
            position: fixed;
            width: 0;
            top: @navHeight;
            left: 0;
            bottom: 0;
            text-align: left;
            z-index: @myMenuZIndex;
            .my-menu:not(.el-menu--collapse) {
                width: @menuTotalWidth;
            }
        }

        .nav {
            height: @navHeight;
            min-width: @projectMinWidth;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            display: flex;
            background-color: dodgerblue;
            z-index: @myNavZIndex;

            align-items: center;
            justify-content: space-between;

            .left-container {
                display: flex;
                align-items: center;
                justify-content: left;
                height: 100%;

                .hamburger-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    width: @menuMinWidth;
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
                    /*text-align: center;*/
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    &:hover {
                        background-color: @hoverColor;
                    }

                    a {
                        text-align: center;
                        font-weight: bold;
                        color: #fff;
                        font-size: 20px;
                        width: 100%;
                        text-decoration: none;

                        .logo-lg {
                            height: @navHeight;
                            object-fit: fill;
                        }
                    }
                }
            }

            .right-container {
                display: flex;
                align-items: center;
                justify-content: right;
                height: 100%;

                .avatar {
                    border-radius: 50%;
                    border: 1px solid white;
                    height: @navHeight * 0.65;
                    width: @navHeight * 0.65;
                    background-color: #607d8b;
                    margin-right: 2rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    span {
                        color: white;
                        font-size: @navHeight * 0.4;
                    }
                }
            }

        }
    }
</style>