const checkIfInnerAddress = (host) => {
    let hostWithoutPort = host;
    const regPort = /^(.+)?:(\d+)/;
    if (regPort.test(host)) {
        hostWithoutPort = RegExp.$1;
    }
    if (hostWithoutPort === "127.0.0.1" || hostWithoutPort === "localhost") {
        return true;
    }
    const regIP = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
    if (regIP.test(hostWithoutPort)) {
        const a = RegExp.$1, b = RegExp.$2;
        // A类内网地址
        if (a === "10") {
            return true;
        }
        // B类内网地址
        if (a === "172") {
            const bNum = parseInt(b);
            if (bNum >= 16 && bNum <= 31) {
                return true;
            }
        }
        // C类内网地址
        if (a === "192" && b === "168") {
            return true;
        }
    }
    return false;
};

export {checkIfInnerAddress}