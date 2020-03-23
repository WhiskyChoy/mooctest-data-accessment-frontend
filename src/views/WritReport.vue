<template lang="pug">
    div.center-view-container
        div.center-view-header
            h1.center-view-title 裁判文书单篇测评结果
            div.header-button-container
                el-button(@click="downloadPDF") 下载为PDF
                //查看原文先不提供
                el-button(:disabled="true") 查看原文
        div.center-view-body
            div.report-container(ref="my-report" v-loading="loading")
                // 有了多种类型裁判文书支持后这里"民事"最好用传值的形式带进来
                h2.inner-report-title 民事裁判文书质量测评报告
                el-collapse(v-model="outer_active"  v-if="received_data")
                    el-collapse-item.indicator-container(name="basic-info")
                        template(slot="title")
                            h3 基本信息
                        div.indicator-body
                            el-row(:gutter="10")
                                el-col(:sm="24" :lg="18")
                                    div.report-long-container
                                        div.report-long-indicator 文书标题：
                                        div.report-long {{received_data.title}}
                                el-col(:sm="24" :lg="6") 客观总分：
                                    span.score-total {{received_data.object_score.toFixed(1)}}
                            el-row(:gutter="10")
                                el-col(:sm="24" :lg="18")
                                    div.report-long-container
                                        div.report-long-indicator 生成时间：
                                        div.report-long {{new Date(received_data.time).toLocaleString()}}
                                el-col(:sm="24" :lg="6") 主观总分：
                                    span.score-total {{received_data.subject_score.toFixed(1)}}
                            div.metrics
                                div.report-long-container
                                    div.report-long-indicator 度量指标：
                                    div.report-long
                                        el-tag.my-tag(v-for="metric of received_data.metrics") {{metric}}
                    el-collapse-item.indicator-container(name="objective-indicator")
                        template(slot="title")
                            h3 客观指标
                        el-collapse(v-model="objective_active")
                            el-collapse-item.indicator-container(name="pzwzx")
                                template(slot="title")
                                    h4 篇章完整性
                                div.indicator-body
                                    div.check-point-container
                                        div.check-point(v-for="item of received_data.pzwzx")
                                            div {{item.name}}
                                            i.my-info(:class="item.score===0?'el-icon-success':item.score===1?'el-icon-error':item.score===2?'el-icon-warning':'el-icon-question'")
                                                el-collapse(v-model="subjective_active")
                            el-collapse-item.indicator-container(name="xxsm")
                                template(slot="title")
                                    h4 详细说明
                                div.indicator-body
                                    el-table(:data="received_data.xxsm" style="width:100%" stripe border)
                                        el-table-column(prop="content" label="内容")
                                        el-table-column(prop="advice" label="建议")
                                            template(slot-scope="scope")
                                                ul(v-if="scope.row.advice&&scope.row.advice.length>0")
                                                    li(v-for="item of scope.row.advice" style="color:darkred") {{item}}
                                                div(style="text-align:center")
                                                    el-tag(type="success" v-if="!scope.row.advice||scope.row.advice.length===0") 无明显错误，无相关建议
                            el-collapse-item.indicator-container(name="xzx")
                                template(slot="title")
                                    h4 细致性
                                div.simple-center
                                    div.indicator-body.progress-container
                                        el-row(:gutter="10" v-if="received_data.xzx&&received_data.xzx.content&&received_data.xzx.content.cat_score&&received_data.xzx.content.tol_score")
                                            el-col(:span="8") 整体情况
                                            el-col(:span="16")
                                                my-progress(:score="received_data.xzx.content.cat_score" :total="received_data.xzx.content.tol_score")
                                        div(v-if="received_data.xzx.content.submetric")
                                            el-row(:gutter="10" v-for="item of received_data.xzx.content.submetric")
                                                el-col(:span="8") {{item.metric}}
                                                el-col(:span="16")
                                                    my-progress(:score="item.score" :total="item.total")

                            el-collapse-item.indicator-container(name="ycx")
                                template(slot="title")
                                    h4 延迟性
                                div.simple-center
                                    div.indicator-body.progress-container
                                        el-row(:gutter="10" v-if="received_data.ycx&&received_data.ycx.content&&received_data.ycx.content.cat_score&&received_data.ycx.content.tol_score")
                                            el-col(:span="8") 整体情况
                                            el-col(:span="16")
                                                my-progress(:score="received_data.ycx.content.cat_score" :total="received_data.ycx.content.tol_score")
                                        div(v-if="received_data.ycx.content.submetric")
                                            el-row(:gutter="10" v-for="item of received_data.ycx.content.submetric")
                                                el-col(:span="8") {{item.metric}}
                                                el-col(:span="16")
                                                    my-progress(:score="item.score" :total="item.total")

                            el-collapse-item.indicator-container(name="radar")
                                template(slot="title")
                                    h4 客观指标雷达图
                                div.indicator-body.simple-center
                                    my-radar(v-if="received_data.radar" :rawArr="received_data.radar" title="客观指标得分雷达图" legend="客观指标")
                    el-collapse-item.indicator-container(name="subjective-indicator")
                        template(slot="title")
                            h3 主观指标
                        el-collapse(v-model="subjective_active")
                            el-collapse-item.indicator-container(name="cxjc")
                                template(slot="title")
                                    h4 抄袭检测
                                div.simple-center
                                    div.indicator-body.progress-container
                                        el-row(:gutter="10" v-if="received_data.cxjc&&received_data.cxjc.score&&received_data.cxjc.total")
                                            el-col(:span="8") 整体情况
                                            el-col(:span="16")
                                                my-progress(:score="received_data.cxjc.score" :total="received_data.cxjc.total")
                                        el-row(:gutter="10")
                                            el-col(:span="8") 抄袭推测
                                            el-col(:span="16")
                                                span(style="color:red" v-if="received_data.cxjc.conclusion") {{received_data.cxjc.conclusion}}
                                                el-tag(type="success" v-if="!received_data.cxjc.conclusion") 未发现明显抄袭
                        el-collapse(v-model="subjective_active")
                            el-collapse-item.indicator-container(name="yyfg")
                                template(slot="title")
                                    h4 语言风格
                                div.indicator-body
                                    my-paragraph-color-gradient.my-gradient(:show-advance="show_gradient_advance" :h-val="0" :sentence-seq="received_data.yyfg")
                                    div 可能存在问题的句子/词组：
                                    ul
                                        li(v-for="item of received_data.yyfg.filter(val=>{return val.delta>0.5})") {{item.sentence}}
                        el-collapse(v-model="subjective_active")
                            el-collapse-item.indicator-container(name="kgcd")
                                template(slot="title")
                                    h4 客观程度
                                div.indicator-body
                                    my-paragraph-color-gradient.my-gradient(:show-advance="show_gradient_advance" :h-val="60" :sentence-seq="received_data.kgcd")
                                    div 可能存在问题的句子/词组：
                                    ul
                                        li(v-for="item of received_data.kgcd.filter(val=>{return val.delta>0.5})") {{item.sentence}}
                        el-collapse(v-model="subjective_active")
                            el-collapse-item.indicator-container(name="xsal")
                                template(slot="title")
                                    h4 相似案例引用高频法条
                                ul(v-if="received_data.xsal")
                                    li(v-for="item of received_data.xsal") {{item}}


</template>

<script>
    //el-col大小分布 [xs]768[sm]992[md]1200[lg]1920[xl]
    import MyProgress from "@/components/MyProgress";
    import MyRadar from "@/components/MyRadar";
    import MyParagraphColorGradient from "@/components/MyParagraphColorGradient";
    import jsPdfDownload from "@/utils/pdfDownloader"
    import {wait, waitVue} from "@/utils/loadWaiter";

    let outer_active, objective_active, subjective_active;

    export default {
        name: "WritReport",
        components: {MyParagraphColorGradient, MyRadar, MyProgress},
        async beforeMount() {
            //展开所有列表
            this.openAllCollapse();
            //获取数据
            this.loading = true;
            const data = await this.$api.getWritReport(this.writ_id);
            //如果不是undefined
            if (data) {
                this.received_data = data;
            }
            this.loading = false;
        },
        props: {
            writ_id: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                loading: false,
                show_gradient_advance: true,
                outer_active: null,
                objective_active: null,
                subjective_active: null,
                received_data: null,
                force_open_gradient: true
            }
        },
        methods: {
            openAllCollapse() {
                this.outer_active = ["basic-info", "objective-indicator", "subjective-indicator"];
                this.objective_active = ["pzwzx", "xxsm", "xzx", "ycx", "radar"];
                //重构检测-抄袭检测(xgjx->cxjc) 情感分析-客观程度（qgfx->kgcd）
                //相似案例 扩写 相似案例引用法条
                this.subjective_active = ["cxjc", "yyfg", "kgcd", "xsal"];
            },
            saveCollapseStatus() {
                outer_active = this.outer_active;
                objective_active = this.objective_active;
                subjective_active = this.subjective_active;
            },
            recoverCollapseStatus() {
                this.outer_active = outer_active;
                this.objective_active = objective_active;
                this.subjective_active = subjective_active;
            },
            async downloadPDF() {
                const loading = this.$loading({fullscreen: true});
                const target = this.$refs['my-report'];
                let fileName = '单篇裁判文书报告：';
                if (this.received_data && this.received_data && this.received_data.title) {
                    fileName += this.received_data.title;
                }
                fileName += '_' + new Date().getTime().toString();
                this.saveCollapseStatus();
                this.openAllCollapse();
                this.show_gradient_advance = false;
                target.classList.add('report-body-to-print');
                //等待VUE渲染完毕
                await waitVue();
                //再等1000毫秒保险
                await wait(1000);
                await jsPdfDownload(fileName, target);
                this.show_gradient_advance = true;
                this.recoverCollapseStatus();
                target.classList.remove('report-body-to-print');
                //以服务的方式调用的 Loading 需要异步关闭
                loading.close();
            }
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

    @media screen and (max-width: 815px) {

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

    .check-point-container {
        display: flex;
        flex-direction: row;
    }

    .check-point {
        display: flex;
        flex-direction: column;
        text-align: center;
        flex: 1;
        border-bottom: 1px solid gray;
        border-top: 1px solid gray;
    }

    .my-info {
        font-size: 1rem;
        &.el-icon-success {
            color: green;
        }
        &.el-icon-error {
            color: red;
        }
        &.el-icon-warning {
            color: chocolate;
        }
        &.el-icon-question {
            color: gray;
        }
    }

    .progress-container {
        min-width: 380px;
        width: 75%;
    }

    .simple-center {
        display: flex !important;
        justify-content: center;
        align-items: center;
    }

    .my-gradient {
        font-size: 1rem;
        font-weight: bolder;
    }

    .inner-report-title {
        text-align: center;
    }
</style>