function getKebabCase(str) {
    return str.replace(/[A-Z]/g, ($0) => '-' + $0.toLowerCase())
}

function getCamelCase(str) {
    return str.replace(/-([a-z])/g, ($0, $1) => $1.toUpperCase())
}

export {getKebabCase, getCamelCase}