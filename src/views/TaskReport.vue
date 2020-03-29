<template lang="pug">
    div.center-view-container
        div.center-view-header
            h1.center-view-title 裁判文书综合测评结果
            div.header-button-container
                el-button(@click="downloadPDF" :disabled="loading") 下载为PDF
                //查看原文先不提供
                el-button(@click="downloadJSON") 下载为json
                el-button(@click="getWritsInTask") 任务内文书
        div.center-view-body
            div.report-container(ref="my-report" v-loading="loading")
                // 有了多种类型裁判文书支持后这里"民事"最好用传值的形式带进来
                h2.inner-report-title 裁判文书质量综合测评报告
                el-collapse(v-model="outer_active"  v-if="received_data")
                    el-collapse-item.indicator-container(name="basic-info")
                        template(slot="title")
                            h3 基本信息
                        div.indicator-body
                            el-row(:gutter="10")
                                el-col(:sm="24" :lg="18")
                                    div.report-long-container
                                        div.report-long-indicator 任务名称：
                                        div.report-long {{received_data.task_name}}
                                el-col(:sm="24" :lg="6") 单篇均分：
                                    span.score-total {{received_data.score_avg.toFixed(1)}}
                            el-row(:gutter="10")
                                el-col(:sm="24" :lg="18")
                                    div.report-long-container
                                        div.report-long-indicator 生成时间：
                                        div.report-long {{new Date(received_data.task_time).toLocaleString()}}
                                el-col(:sm="24" :lg="6") 主观均分：
                                    span.score-total {{received_data.subject_score_avg.toFixed(1)}}
                            el-row(:gutter="10")
                                el-col(:sm="24" :lg="18")
                                    div.report-long-container
                                        div.report-long-indicator 文书数量：
                                        div.report-long {{Math.ceil(received_data.writ_num)}}
                                el-col(:sm="24" :lg="6") 客观均分：
                                    span.score-total {{received_data.object_score_avg.toFixed(1)}}
                            div.metrics
                                div.report-long-container
                                    div.report-long-indicator 度量指标：
                                    div.report-long
                                        el-tag.my-tag(v-for="metric of received_data.metrics") {{metric}}
                    el-collapse-item.indicator-container(name="sample-summary")
                        template(slot="title")
                            h3 样本概况
                        el-collapse(v-model="sample_summary_active")
                            el-collapse-item.indicator-container(name="location_distribution")
                                template(slot="title")
                                    h4 文书地域分布
                                div.indicator-body.simple-center(v-if="false")
                                    my-simple-distribution(title="文书地域分布" :raw-data="received_data.location_distribution")
                                div.indicator-body.simple-center
                                    my-map(title="文书地域分布地图",
                                    :cities="$safeFetch(received_data,'location_distribution.x_axis_data',[])"
                                    :values="$safeFetch(received_data,'location_distribution.series[0].data',[])")
                            el-collapse-item.indicator-container(name="time_distribution")
                                template(slot="title")
                                    h4 文书时间分布
                                div.indicator-body.simple-center
                                    my-simple-distribution(title="文书时间分布" :raw-data="received_data.time_distribution")
                    el-collapse-item.indicator-container(name="test-result")
                        template(slot="title")
                            h3 度量结果
                        el-collapse(v-model="test_result_active")
                            el-collapse-item.indicator-container(name="objective_metric_avg")
                                template(slot="title")
                                    h4 客观指标平均值
                                div.indicator-body.simple-center
                                    my-radar-chart(v-if="received_data.radar" :rawArr="received_data.radar" title="客观指标得分雷达图" legend="客观指标")
                        el-collapse(v-model="test_result_active")
                            el-collapse-item.indicator-container(name="vs_standard")
                                template(slot="title")
                                    h4 对比标准数据集
                                div.indicator-body.simple-center
                                    my-simple-distribution(title="得分对比" :raw-data="received_data.vs_standard_distribution")
        el-dialog.my-list-dialog(v-draggable :title="($safeFetch(received_data,'task_name','')||(task_id+'号'))+'任务文书列表'"
        :visible.sync="dialogVisible" center
        :modal-append-to-body="false"
        :append-to-body="true" top="6vh")
            my-writ-list(:task-id="task_id")


</template>

<script>
    //el-col大小分布 [xs]768[sm]992[md]1200[lg]1920[xl]
    import MyProgress from "@/components/MyProgress";
    import MyRadarChart from "@/components/MyRadarChart";
    import MyParagraphColorGradient from "@/components/MyParagraphColorGradient";
    import jsPdfDownload from "@/utils/pdfDownloader"
    import {wait, waitVue} from "@/utils/loadWaiter";
    import MySimpleDistribution from "@/components/MySimpleDistribution";
    import MyMap from "@/components/MyMap";
    import MyWritList from "@/components/MyWritList";

    let outer_active, sample_summary_active, test_result_active;

    export default {
        name: "WritReport",
        components: {MyWritList, MyMap, MySimpleDistribution, MyParagraphColorGradient, MyRadarChart, MyProgress},
        async beforeMount() {
            //展开所有列表
            this.openAllCollapse();
            //获取数据
            this.loading = true;
            const data = await this.$api.getTaskReport(this.task_id);
            //如果不是undefined
            if (data) {
                this.received_data = data;
            }
            await waitVue();
            this.loading = false;
        },
        props: {
            task_id: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                dialogVisible: false,
                loading: false,
                outer_active: null,
                sample_summary_active: null,
                test_result_active: null,
                received_data: null
            }
        },
        methods: {
            openAllCollapse() {
                this.outer_active = ["basic-info", "sample-summary", "test-result"];
                this.sample_summary_active = ["location_distribution", "time_distribution"];
                this.test_result_active = ["objective_metric_avg", "vs_standard"];
            },
            saveCollapseStatus() {
                outer_active = this.outer_active;
                sample_summary_active = this.sample_summary_active;
                test_result_active = this.test_result_active;
            },
            recoverCollapseStatus() {
                this.outer_active = outer_active;
                this.sample_summary_active = sample_summary_active;
                this.test_result_active = test_result_active;
            },
            async downloadPDF() {
                const loading = this.$loading({fullscreen: true});
                await waitVue();
                const target = this.$refs['my-report'];
                let fileName = '综合报告：';
                if (this.received_data && this.received_data && this.received_data.task_name) {
                    fileName += this.received_data.task_name;
                }
                fileName += '_' + new Date().getTime().toString();
                this.saveCollapseStatus();
                this.openAllCollapse();
                target.classList.add('report-body-to-print');
                //等待VUE渲染完毕
                await waitVue();
                //再等1000毫秒保险
                await wait(1000);
                await jsPdfDownload(fileName, target);
                this.recoverCollapseStatus();
                target.classList.remove('report-body-to-print');
                //以服务的方式调用的 Loading 需要异步关闭说的是引入{Loading}的还是this.$loading?
                loading.close();
            },
            async downloadJSON() {
                const loading = this.$loading({fullscreen: true});
                const download_url = await this.$api.getTaskReportJSON(this.task_id);
                if (download_url) {
                    let file = await this.$api.downloadTaskReportJSON(download_url);
                    if (file) {
                        let a = document.createElement('a');
                        a.href = URL.createObjectURL(file);
                        a.download = this.$safeFetch(this.received_data, 'task_name', '') || (this.task_id + '号') + '任务分析结果.json';
                        a.click();
                    }
                }
                loading.close();
            },
            getWritsInTask() {
                this.dialogVisible = true;
            },
        }
    }
</script>

<style scoped lang="less">
    @import "../assets/global";

    .header-button-container {
        position: fixed;
        top: @navHeight+@reportHeaderMargin;
        right: 1rem;
    }

    @media screen and (max-width: 1150px), screen and (orientation: portrait) {

        .header-button-container {
            position: static;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 1rem;
        }

        .center-view-body {
            margin-top: @navHeight+@reportHeaderMargin*2+10px+40px !important;
        }
    }

    .my-list-dialog /deep/ .el-dialog{
        width: 70%!important;
        min-width: 300px;
    }

    .my-list-dialog /deep/ .el-dialog__body{
        height: 500px;
    }

    .my-list-dialog /deep/.my-writ-or-task-table{
        height: 500px!important;
    }

    .my-list-dialog /deep/ .my-writ-or-task-table .el-tag span {
        display: none;
    }

    .my-list-dialog /deep/ .my-writ-or-task-table .my-button span {
        display: none;
    }

    .report-long-container {
        display: flex;
    }

    .report-long-indicator {
        flex-shrink: 0;
    }

    .report-long {
        color: darkgray;
    }

    .score-total {
        color: red;
        font-weight: bolder;
        font-size: 1.15rem;
    }

    .report-container {
        width: 80%;
        max-width: 1000px;
        border-radius: 10px;
        border: 2px dotted #000;
        padding: 1rem;
        min-height: 800px;
        margin-bottom: 5rem;
        /*box-sizing: border-box;*/
    }

    .report-body-to-print ul {
        list-style-type: none;
    }

    .indicator-container {
        margin: 2rem;

        h3 {
            text-align: left;
            padding-bottom: 0.5rem;
            font-size: 1.2rem;
        }
    }

    .indicator-body {
        & > * {
            margin-bottom: 1rem;
        }
    }

    .my-tag {
        margin-right: 1rem;
        margin-bottom: 1rem;
    }

    .inner-report-title {
        text-align: center;
    }

    .simple-center {
        display: flex !important;
        justify-content: center;
        align-items: center;
    }
</style>