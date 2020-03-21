import Scrollbar from '@/components/MyDynamicScroller'
//自定义滚动条
import PerfectScrollbar from 'perfect-scrollbar';
//对应的css
import "perfect-scrollbar/css/perfect-scrollbar.css";

const scrollableOld = (Vue) => {
    if (install.installed) {
        return
    }
    Vue.directive('scrollable', {
        inserted: (el, binding) => {
            const tableBodyWrapper = el.querySelector('.el-table__body-wrapper');
            let childNode = tableBodyWrapper.querySelector('table');
            let parentNode = tableBodyWrapper.parentNode;
            let container = document.createElement('div');
            let height = binding.value && binding.value.height ? binding.value.height : childNode.style && childNode.style.height ? childNode.style.height : undefined;
            //有child，childNode就是child，没有就是el
            //有parent，parentNode就是parentNode，否则就是child的parentNode
            //replaceChild(newnode,oldnode)
            parentNode.replaceChild(container, tableBodyWrapper);

            //这里失败了，一直无法解决，因为scrollbar需要接受一个slot，后面才能识别offset
            const scrollbar = new Vue({render: h => h(Scrollbar, {props: {height}})});
            scrollbar.$mount(container);
            //先mount了才会render
            const scrollbarEl = scrollbar.$el;
            const scrollbarView = scrollbarEl.querySelector('.el-scrollbar__view');
            scrollbarView.appendChild(childNode);
        }
    });
};

/**
 * @description 为自定义滚动条全局注入自定义指令。自动判断该更新PerfectScrollbar还是创建它
 * @param {Element} el - 必填。dom元素
 */
const el_scrollBar = (el) => {
    //在元素上加点私货，名字随便取，确保不会和已有属性重复即可，我取名叫做_ps_
    if (el._ps_ instanceof PerfectScrollbar) {
        el._ps_.update();
    } else {
        //el上挂一份属性
        el._ps_ = new PerfectScrollbar(el, {suppressScrollX: true});
    }
};


//不要直接el=xxx，传的是引用，会修改到
const getElement = (el, modifiers) => {
    let result = el;
    if (modifiers && modifiers['el-table']) {
        result = el.querySelector(".el-table__body-wrapper");
        if (!result) {
            console.warn("未发现className为el-table__body-wrapper的dom");
            return el;
        }
    }
    if (modifiers && modifiers['el-upload']) {
        //注意这里不能每次都创建，没有才创建
        //perfect scrollba 必须挂在container上，container里面只有一个元素
        result = el.querySelector('.upload-list-container');
        if (!result) {
            let ul = el.querySelector('.el-upload-list');

            if (!ul) {
                console.warn("未发现className为el-upload-list的dom");
                return el;
            }
            let div = document.createElement('div');
            div.className = 'upload-list-container';
            let parentNode = ul.parentNode;
            parentNode.removeChild(ul);
            div.appendChild(ul);
            parentNode.appendChild(div);
            result = div;
        }
    }
    return result;
};

const doNextTick = (vnode, callback) => {
    vnode.context.$nextTick(
        () => {
            try {
                callback();
            } catch (error) {
                console.error(error);
            }
        }
    )
};

const bind = (el, binding, vnode) => {
    window.onresize = () => {
        const elem = getElement(el, binding.modifiers);
        doNextTick(vnode, () => {
            el_scrollBar(elem)
        });
    }
};

const unbind = () => {
    window.onresize = null;
};

const inserted = (el, binding, vnode) => {
    const elem = getElement(el, binding.modifiers);
    const rules = ["fixed", "absolute", "relative"];
    if (!rules.includes(window.getComputedStyle(elem, null).position)) {
        console.info(`perfect-scrollbar所在的容器的position属性必须是以下之一：${rules.join("、")}，已修改为relative`);
        elem.style.position = 'relative'
    }
    if (binding.modifiers && binding.modifiers['el-table']) {
        doNextTick(vnode, () => {
            el_scrollBar(elem)
        });
    }
    el_scrollBar(elem);
};

const update = (el, binding, vnode) => {
    const elem = getElement(el, binding.modifiers);
    doNextTick(vnode, () => {
        el_scrollBar(elem)
    });
};

const scrollableNew = (Vue) => {
    Vue.directive("scrollable", {
        bind,
        inserted,
        update,
        unbind
    });
};

export {scrollableOld, scrollableNew}