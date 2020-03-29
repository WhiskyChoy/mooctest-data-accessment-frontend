<template lang="pug">
    div(ref="line" style="width: 480px; height:480px;")
</template>

<script>
    import echarts from 'echarts'

    export default {
        name: "MySimpleDistribution",
        props: {
            title: {
                type: String,
                required: true
            },
            rawData: {
                type: Object,
                required: true
            }
        },
        beforeMount() {
            this.option.title.text = this.title;
            let xAxis = this.option.xAxis[0];
            xAxis.data = this.rawData && this.rawData.x_axis_data ? this.rawData.x_axis_data : [];
            xAxis.axisLabel.interval = xAxis.data.length <= 8 ? 0 : 'auto';
            xAxis.axisLabel.show = xAxis.data.length <= 8;
            const series = this.rawData && this.rawData.series ? this.rawData.series : [];
            let legend_data = [];
            series.forEach(item => {
                item.name && legend_data.push(item.name);
                item.type || (item.type = 'bar');
                item.data || (item.data = []);
                item.markPoint = {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                };
                item.markLine = {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            });
            this.option.legend.data = legend_data;
            this.option.series = series;
        },
        async mounted() {
            await this.$nextTick();
            const radar = this.$refs['line'];
            const chart = echarts.init(radar);
            chart.setOption(this.option);
        },
        data() {
            return {
                option: {
                    title: {
                        text: '',
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: []
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            magicType: {show: true, type: ['line', 'bar']},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            data: [],
                            axisLabel: {
                                show: true,
                                interval: 'auto'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: []
                }
            }
        }
    }
</script>

<style scoped lang="less">

</style>