<template lang="pug">
    span(v-if="sequence")
        my-word-color-gradient(v-for="item of sequence" :h-val="hVal" :start-val="item.startVal" :end-val="item.endVal" :char="item.char" :show-advance="showAdvance" :emphasize-rate="emphasizeRate")
</template>

<script>
    import MyWordColorGradient from "@/components/MyWordColorGradient";

    const getSequence = (sentence, sentenceStartVal, sentenceEndVal) => {
        let sequence = [];
        const chars = sentence.split('');
        const length = chars.length;
        const delta = (sentenceEndVal - sentenceStartVal) / length;
        for (let i = 0; i < length; i++) {
            let char = chars[i];
            let startVal = sentenceStartVal + i * delta;
            let endVal = sentenceStartVal + (i + 1) * delta;
            sequence.push({char, startVal, endVal})
        }
        return sequence;
    };

    export default {
        name: "MySentenceColorGradient",
        components: {MyWordColorGradient},
        props: {
            sentence: {
                type: String,
                required: true
            },
            startVal: {
                type: Number,
                required: true
            },
            endVal: {
                type: Number,
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
        beforeMount() {
            this.sequence = getSequence(this.sentence, this.startVal, this.endVal)
        },
        data() {
            return {
                sequence: null
            }
        }
    }
</script>