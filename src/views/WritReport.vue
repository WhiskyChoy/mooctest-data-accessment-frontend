<template lang="pug">
    div.writ-report-container
        div.report-header
            h1 裁判文书测评报告
            div.header-button-container
                el-button 下载为PDF
                el-button 查看原文
        div.report-body-outer-container
            div.report-body-inner-container
                div.indicator-container
                    h3 基本信息
                    div.indicator-body
                        el-row(:gutter="10")
                            el-col(:sm="24" :lg="18")
                                div.writ-long-container
                                    div.writ-long-indicator 文书标题：
                                    div.writ-long {{received_data.title}}
                            el-col(:sm="24" :lg="6") 客观总分：
                                span.score-total {{received_data.object_score.toFixed(1)}}
                        el-row(:gutter="10")
                            el-col(:sm="24" :lg="18")
                                div.writ-long-container
                                    div.writ-long-indicator 生成时间：
                                    div.writ-long {{new Date(received_data.time).toLocaleString()}}
                            el-col(:sm="24" :lg="6") 主观总分：
                                span.score-total {{received_data.subject_score.toFixed(1)}}
                        div.metrics
                            div.writ-long-container
                                div.writ-long-indicator 度量指标：
                                div.writ-long
                                    el-tag.my-tag(v-for="metric of received_data.metrics") {{metric}}


</template>

<script>
    //el-col大小分布 [xs]768[sm]992[md]1200[lg]1920[xl]
    import fakeData from '@/fake_data/test_report'

    export default {
        name: "WritReport",
        beforeMount() {
            if (process.env.NODE_ENV === 'debug') {
                this.received_data = fakeData;
            }
        },
        props: {
            "writ_id": {
                type: String,
                required: true
            }
        },
        data() {
            return {
                received_data: null
            }
        }
    }
</script>

<style scoped lang="less">
    .writ-report-container {
        display: flex;
        flex-direction: column;
    }

    .report-header {
        position: relative;
        top: 0;
    }

    .header-button-container {
        position: absolute;
        top: 1.5rem;
        right: 1rem;
    }

    @media screen and (max-width: 750px) {
        .header-button-container {
            position: static;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 1rem;
        }
    }

    .writ-long-container {
        display: flex;
    }

    .writ-long-indicator {
        flex-shrink: 0;
    }

    .writ-long {
        color: darkgray;
    }

    .score-total {
        color: red;
    }

    .report-body-outer-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .report-body-inner-container {
        width: 80%;
        max-width: 1000px;
        border-radius: 10px;
        border: 2px dotted #000;
        padding: 1rem;
        min-height: 800px;
        margin-bottom: 2rem;
    }

    .indicator-container {
        margin: 2rem;

        h3 {
            text-align: left;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #000;
        }
    }

    .indicator-body>*{
        margin-bottom: 1rem;
    }

    .my-tag{
        margin-right: 1rem;
        margin-bottom: 1rem;
    }
</style>