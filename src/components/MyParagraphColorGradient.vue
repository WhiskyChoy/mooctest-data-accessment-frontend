<template lang="pug">
    div(v-if="transformedSeq")
        my-sentence-color-gradient(:h-val="hVal" :show-advance="showAdvance" v-for="item of transformedSeq" :sentence="item.sentence" :start-val="item.startVal" :end-val="item.endVal" :emphasize-rate="emphasizeRate")
</template>

<script>
    import MySentenceColorGradient from "@/components/MySentenceColorGradient";

    const transformSeq = (seq) => {
        let length = seq.length;
        let result = [];
        for (let i = 0; i < length; i++) {
            if (i === length - 1) {
                result.push({
                    sentence: seq[i].sentence,
                    startVal: seq[i].delta,
                    endVal: 0
                })
            } else {
                result.push({
                    sentence: seq[i].sentence,
                    startVal: seq[i].delta,
                    endVal: seq[i + 1].delta
                })
            }
        }
        return result;
    };

    export default {
        components: {MySentenceColorGradient},
        props: {
            sentenceSeq: {
                type: Array,
                required: true
            },
            hVal: {
                type: Number,
                default: 0
            },
            showAdvance: {
                type: Boolean,
                default: true
            },
            emphasizeRate:{
                type: Number,
                default: 1
            }
        },
        name: "MyParagraphColorGradient",
        beforeMount() {
            this.transformedSeq = transformSeq(this.sentenceSeq);
        },
        data() {
            return {
                transformedSeq: null
            }
        }
    }
</script>

<style scoped lang="less">

</style>