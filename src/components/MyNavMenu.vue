<template lang="pug">
    //:default-active="$route.path"比较危险，要确保index里的路径确实在路由里注册了
    el-menu(router :default-active="$route.path" :collapse="collapse" style="height:100%")
        el-menu-item(index="/resources/writ-upload")
            i.el-icon-upload
            span(slot="title") 上传文书
        el-menu-item(index="/resources/writ-overall")
            i.el-icon-document
            span(slot="title") 我的文书
        el-menu-item(index="/resources/task-overall")
            i.el-icon-folder
            span(slot="title") 任务列表
        el-menu-item(index="/resources/config-default")
            i.el-icon-setting
            span(slot="title") 默认配置
</template>

<script>
    export default {
        name: "MyNavMenu",
        props: {
            "collapse": {
                type: Boolean,
                require: true
            },
        }
    }
</script>