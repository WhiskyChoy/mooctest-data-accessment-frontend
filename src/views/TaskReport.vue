<template lang="pug">
    div 任务报告页{{task_id}}
</template>

<script>
    export default {
        name: "TaskReport",
        props: {
            "task_id":{
                type: Number,
                required: true
            }
        }
    }
</script>

<style scoped lang="less">

</style>