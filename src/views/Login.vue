<template lang="pug">
    div.login-panel
        div.login-container
            div.logo-container
                img.mooctest-img(src="../assets/mooctest.png")
                h2 裁判文书质量检测系统
                div.description [本系统暂时只支持慕测授权登录]
                el-button(@click="getAuthCode").login-button 授权登录

</template>

<script>
    export default {
        name: "Login",
        methods: {
            getAuthCode() {
                const result = this.$api.getAuthCode();
                if(!result){
                    this.$message.error('未注册OAUTH地址');
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .login-panel {
        background: url("../assets/bg.jpg") no-repeat center;
        background-size: cover;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        .login-container {
            height: 280px;
            width: 260px;
            padding: 50px;
            background-color: white;
            box-shadow: 2px 4px 4px #333;
            border-radius: 1%;
            max-width: 100%;

            .logo-container {
                text-align: center;
                height: 95px;
                .mooctest-img {
                    height: 100%;
                    object-fit: contain;
                }
                .description {
                    color: gray;
                    margin-bottom: 2rem;
                }
                .login-button {
                    width: 100%;
                    color: #fff;
                    background-color: #337ab7;
                    border-color: #2e6da4;
                    &:hover {
                        background-color: #286090;
                        border-color: #204d74;
                    }
                }
            }
        }
    }
</style>