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
            return console.warn("未发现className为el-table__body-wrapper的dom");
        }
    }
    return result;
};

const bind = (el, binding) => {
    window.onresize = () => {
        const elem = getElement(el, binding.modifiers);
        el_scrollBar(elem);
    }
};

const unbind = () => {
    window.onresize = null;
};

const inserted = (el, binding) => {
    const elem = getElement(el, binding.modifiers);
    const rules = ["fixed", "absolute", "relative"];
    if (!rules.includes(window.getComputedStyle(elem, null).position)) {
        console.error(`perfect-scrollbar所在的容器的position属性必须是以下之一：${rules.join("、")}`)
    }
    el_scrollBar(elem);
};

const update = (el, binding, vnode) => {
    const elem = getElement(el, binding.modifiers);
    vnode.context.$nextTick(
        () => {
            try {
                el_scrollBar(elem);
            } catch (error) {
                console.error(error);
            }
        }
    )
};

const scrollableNew = (Vue) => {
    Vue.directive("scrollable", {
        bind,
        inserted,
        update,
        componentUpdated: update,
        unbind
    });
};

export {scrollableOld, scrollableNew}