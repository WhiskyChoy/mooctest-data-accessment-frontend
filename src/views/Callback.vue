<script>
    import {login} from "@/utils/userUtil";
    import {redirectKey} from "@/utils/urlUtil";

    export default {
        name: "Callback",
        props: {
            code: {
                type: String,
                required: true
            }
        },
        render: () => {
        },
        async mounted() {
            const loading = this.$loading({
                lock: true,
                text: '正在加载个人信息',
            });
            const user = await this.$api.getUser(this.code);
            if (user) {
                login(user);
                const duration = 1500;
                this.$notify.success({title: '登录成功', message: '点击左侧汉堡菜单开始工作', duration});
                this.$router.push(localStorage.getItem(redirectKey) || '/');
            } else {
                this.$router.push('/login');
            }
            loading.close();
        },
    }
</script>

<style scoped lang="less">

</style>