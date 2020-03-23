<script>
    import {login} from "@/utils/userUtil";

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
            }
            loading.close();
            const duration = 1500;
            this.$notify.success({title: '登录成功', message: '点击左侧汉堡菜单开始工作', duration});
            this.$router.push('/');
        },
    }
</script>

<style scoped lang="less">

</style>