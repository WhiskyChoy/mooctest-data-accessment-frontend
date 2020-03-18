const orderFunc = (el, binding) => {
    const inputDragHeader = binding && binding.value && binding.value.dragHeader ? binding.value.dragHeader : '.el-dialog__header';
    const inputDragDom = binding && binding.value && binding.value.dragDom ? binding.value.dragDom : '.el-dialog';
    const dragHeader = el.querySelector(inputDragHeader);
    const dragDom = el.querySelector(inputDragDom);
    if (!dragHeader || !dragDom) {
        console.log('element not found');
        return
    }
    dragHeader.style.cursor = 'move';

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

    let styL1, styT1;

    // 如果传入了X和Y,则设置为X和Y
    // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
    if (binding && binding.value && binding.value.screenX && binding.value.screenY) {
        let dialogWidth = sty.width;
        if (dialogWidth.includes('%')) {
            dialogWidth = +document.body.clientWidth * (dialogWidth.replace(/%/g, '') / 100);
        } else {
            dialogWidth = +dialogWidth.replace(/px/g, '');
        }

        dragDom.style.marginTop = '0';
        let left = binding.value.screenX - document.body.clientWidth / 2 + dialogWidth / 2;
        let top = binding.value.screenY;
        dragDom.style.left = `${left}px`;
        dragDom.style.top = `${top}px`;
    }
    else if (sty.left.includes('%')) {
        styL1 = +document.body.clientWidth * (+sty.left.replace(/%/g, '') / 100);
        styT1 = +document.body.clientHeight * (+sty.top.replace(/%/g, '') / 100);
        dragDom.style.left = `${styL1}px`;
        dragDom.style.top = `${styT1}px`;
    }


    dragHeader.onmousedown = (e) => {
        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX - dragHeader.offsetLeft;
        const disY = e.clientY - dragHeader.offsetTop;

        // 获取到的值带px 正则匹配替换
        let styL, styT;

        styL = +sty.left.replace(/px/g, '');
        styT = +sty.top.replace(/px/g, '');

        document.onmousemove = function (e) {
            // 通过事件委托，计算移动的距离
            const l = e.clientX - disX;
            const t = e.clientY - disY;

            // 移动当前元素
            dragDom.style.left = `${l + styL}px`;
            dragDom.style.top = `${t + styT}px`;

            //将此时的位置传出去
            //binding.value({x:e.pageX,y:e.pageY})
        };

        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    }
};

const install = (Vue) => {
    if (install.installed) {
        return
    }
    Vue.directive('draggable', {inserted:orderFunc});
};

export default install
