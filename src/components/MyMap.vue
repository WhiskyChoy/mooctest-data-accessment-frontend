<template lang="pug">
    div(ref="map" style="width: 520px; height:520px;")
</template>

<script>
    import echarts from 'echarts'

    export default {
        name: "MyMap",
        props: {
            cities: {
                type: Array,
                default: () => []
            },
            values: {
                type: Array,
                default: () => []
            },
            title: {
                type: String,
                required: true
            }
        },
        beforeMount() {
            const cities = this.cities;
            const values = this.values;
            const max = Math.max(...values);
            const min = Math.min(...values);
            let length = Math.min(cities.length || 0, values.length || 0);
            let result = [];
            for (let i = 0; i < length; i++) {
                result.push({
                    name: cities[i].replace(/(壮族|回族|维吾尔)?(自治区|省|市|特别行政区)/, ''),
                    value: values[i]
                });
            }
            this.option.series[0].data = result;
            this.option.series[0].name = this.title;
            this.option.title.text = this.title;
            this.option.visualMap.min = min - 1 || 0;
            this.option.visualMap.max = max;
        },
        async mounted() {
            await this.$nextTick();
            const map = this.$refs['map'];
            const chart = echarts.init(map);
            //await import过来的是一个module，里面的default是结果
            const {default: chinaMap} = await import('@/data/json/china.json');
            if (chinaMap) {
                echarts.registerMap('china', chinaMap);
                chart.setOption(this.option);
                chart.on('click', ({name, value}) => {
                    if (!isNaN(value)) {
                        this.$emit('province-click', name);
                    }
                })
            }
        },
        data() {
            return {
                option: {
                    title: {
                        text: '',
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter(val) {
                            return val.name + '<br>' + (val.value ? val.value + '份' : '暂无数据')
                        }
                    },
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        left: 'right',
                        top: 'center',
                        feature: {
                            saveAsImage: {show: true}
                        }
                    },
                    visualMap: {
                        min: 800,
                        max: 50000,
                        text: ['High', 'Low'],
                        realtime: true,
                        calculable: true,
                        inRange: {
                            color: ['lightblue', 'dodgerblue', 'blue']
                        },
                        top: 'center'
                    },
                    series: [
                        {
                            name: '',
                            type: 'map',
                            mapType: 'china', // 自定义扩展图表类型
                            label: {
                                show: true
                            },
                            data: []
                        }
                    ]
                }
            }
        }
    }
</script>

<style scoped lang="less">

</style>