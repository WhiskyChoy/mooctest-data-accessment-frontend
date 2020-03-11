import html2canvas from 'html2canvas'
import JS_PDF from 'jspdf'


// 报告那边考虑提供仪表盘视图
// 下载时要展开所有数据
// 返回的是一个promise，可以把VUE的一个method声明为async，就可以使用await，另可以采用loading布尔值来判断是否下载完成
// https://github.com/niklasvh/html2canvas/issues/1878 必须指定cnpm install html2canvas@1.0.0-rc.1来避免这一问题
async function jsPdfDownload(pdfName = new Date().getTime().toString(), target) {
    const scaleRate = 2;
    const borderWidthSaver = target.style.borderWidth;
    target.style.borderWidth = 0;
    const canvas = await html2canvas(target, {
        scale: window.devicePixelRatio * scaleRate,
        //确认没问题后把logging关掉
        logging: false
    });

    let contentWidth = canvas.width;
    let contentHeight = canvas.height;

    //一页pdf显示html页面生成的canvas高度;
    let pageHeight = contentWidth / 592.28 * 841.89;
    //未生成pdf的html页面高度
    let leftHeight = contentHeight;
    //页面偏移
    let position = 0;
    //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
    let imgWidth = 555.28;//595.28//左右边距20
    let imgHeight = 555.28 / contentWidth * contentHeight;//左右边距20

    let pageData = canvas.toDataURL('image/jpeg', 1.0);

    let pdf = new JS_PDF('', 'pt', 'a4');

    //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
    //当内容未超过pdf一页显示的范围，无需分页
    if (leftHeight < pageHeight) {
        pdf.addImage(pageData, 'JPEG', 20, 0, imgWidth, imgHeight);//左右边距20
    } else {
        while (leftHeight > 0) {
            pdf.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight); //左右边距20
            leftHeight -= pageHeight;
            position -= 841.89;
            //避免添加空白页
            if (leftHeight > 841.89) {
                pdf.addPage();
            }
        }
    }
    pdf.save(pdfName + ".pdf");
    target.style.borderWidth = borderWidthSaver;
}

export default jsPdfDownload