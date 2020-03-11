import {getKebabCase} from "@/utils/caseTransform";

/**
 * @param {String} style
 */
const prefix = ['webkit', 'moz', 'ms', 'o'];

function supportCSSOld(style) {
    let i, kebaCaseStrings = [], htmlStyle = document.documentElement.style;
    for (i in prefix)
        kebaCaseStrings.push(getKebabCase(prefix[i] + '-' + style));

    kebaCaseStrings.push(getKebabCase(style));

    for (i in kebaCaseStrings)
        if (kebaCaseStrings[i] in htmlStyle) return true;

    return false;
}

/**
 * @param {String} style
 * @param {String} value
 */
function supportCSSNew(style, value) {
    let result = CSS.supports && true;
    for (let prefix of prefix) {
        result = result || CSS.supports('-' + prefix + '-' + style, value)
    }
    return result;
}

// not used,
export {supportCSSOld, supportCSSNew}