<template lang="pug">
    el-menu(router default-active="writ" :collapse="collapse" style="height:100%")
        el-menu-item(index="writ")
            i.el-icon-document
            span(slot="title") 我的文书
        el-menu-item(index="task")
            i.el-icon-folder
            span(slot="title") 任务列表
        el-menu-item(index="config")
            i.el-icon-setting
            span(slot="title") 默认配置
</template>

<script>
    export default {
        name: "MyNavMenu",
        props:{
            "collapse": {
                type: Boolean,
                require: true
            },
        }
    }
</script>