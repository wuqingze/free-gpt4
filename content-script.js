function indexofparent(olElement, parentUl){
    let index = -1;
    for (let i = 0; i < parentUl.children.length; i++) {
        if (parentUl.children[i] === olElement) {
            index = i+1;
            break;
        }
    }
    return index;
}

function extractText(element) {
    if (!element) {
        return '';
    }
    if (element.nodeType === Node.TEXT_NODE) {
        return element.textContent.replace(/\n+$/, "");
    }

    if (element.nodeType === Node.ELEMENT_NODE) {
        const tagName = element.tagName.toLowerCase();
        const children = Array.from(element.childNodes).map(extractText).join('');
        if(tagName === 'div' && element.classList.contains('MarkdownCodeBlock_codeHeader__5MZpO')){
            return '';
        }
        switch (tagName) {
            case 'h1':
                return `# ${children}\n`;
            case 'h2':
                return `## ${children}\n`;
            case 'h3':
                return `### ${children}\n`;
            case 'h4':
                return `#### ${children}\n`;
            case 'h5':
                return `##### ${children}\n`;
            case 'h6':
                return `###### ${children}\n`;
            case 'ul':
                return `${children}\n`;
            case 'ol':
                return `${children}\n`;
            case 'li':
                let index = indexofparent(element, element.parentElement);
                // 获取 <ol> 元素的 start 属性的值
                const startValue = element.parentElement.getAttribute('start');
                index = startValue?index+parseInt(startValue):index;
                const parentTagName = element.parentElement.tagName.toLowerCase();
                return parentTagName === 'ol' ? `${index}. ${children}\n` : `* ${children}\n`;
            case 'p':
                return `${children}\n\n`;
            case 'strong':
            case 'b':
                return `**${children}**`;
            case 'em':
            case 'i':
                return `*${children}*`;
            case 'u':
                return `_${children}_`;
            case 'code':
                //return `${children}`;
                return element.textContent;
            case 'pre':
                var lng = element.parentNode.firstChild.firstChild.textContent;
                return "```"+lng+"\n" + `${children}` + "```\n";
            case 'blockquote':
                return `> ${children}\n`;
            case 'a':
                const href = element.getAttribute('href');
                return `[${children}](${href})`;
                // Add more cases for other HTML tags as needed
            case 'br':
                return `\n${children}`
            default:
                return children;
        }
    }

    return '';
}

function copy() {

    var messageListView = document.querySelector("#__next > div > div > section > div > div > div > div");
    var AliceDiv;
    var BobDiv;
    const prefix = 'ChatMessage_messageRow'; // 定义要检查的前缀
    let hasPrefix = Array.from(messageListView.lastChild.children[0].classList)
        .some(className => className.startsWith(prefix)); // 检查元素的class列表中是否有以指定前缀开头的class
    hasPrefix = hasPrefix && Array.from(messageListView.lastChild.children[1].classList)
        .some(className => className.startsWith(prefix)); // 检查元素的class列表中是否有以指定前缀开头的class

    if (hasPrefix) {
        AliceDiv = messageListView.lastChild.children[0];
        BobDiv = messageListView.lastChild.children[1];
    }else{
        AliceDiv = messageListView.lastChild.previousSibling.children[0];
        BobDiv = messageListView.lastChild.previousSibling.children[1];
    }

    var textarea = document.createElement("textarea");
    textarea.style.opacity = 0;
    document.body.appendChild(textarea);

    var usercontent = extractText(AliceDiv);
    var gptcontent = extractText(BobDiv);
    if(! usercontent.startsWith("我是Alice你是Bob,你只能以Bob的身份回答")){
        usercontent = "我是Alice你是Bob,你只能以Bob的身份回答\n\n**Alice**\n"+usercontent;
    }

    if(! gptcontent.startsWith("**Bob**")){
        gptcontent = "**Bob**\n"+gptcontent;
    }

    textarea.value = usercontent+gptcontent+"**Alice**\n";

    // 选择textarea中的文本
    textarea.select();

    // 将文本复制到系统剪贴板中
    document.execCommand("copy");

    // 删除textarea元素
    document.body.removeChild(textarea);
    alert("复制成功");
}

function classfilter(node){
    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('Message_humanMessageBubble__Nld4j')) {
        // 将其 class 属性更改为 Message_botMessageBubble__CPGMI
        node.classList.remove('Message_humanMessageBubble__Nld4j');
        node.classList.add('Message_botMessageBubble__CPGMI');
    }
    if (node.childNodes.length > 0) {
        for (var i = 0; i < node.childNodes.length; i++) {
            classfilter(node.childNodes[i]);
        }
    }

}

function codefilter(node){
    if (node.nodeName === 'CODE') {
        // 获取所有行
        let lines = node.textContent.split('\n');
        // 过滤包含 "```" 的行
        lines = lines.filter(line => !(line.trim() === '```'));
        // 将过滤后的行重新组合成一个字符串
        node.textContent = lines.join('\n');
    }
    if (node.childNodes.length > 0) {
        for (var i = 0; i < node.childNodes.length; i++) {
            codefilter(node.childNodes[i]);
        }
    }
}

function cleanpage(){
    // 创建一个用于观察DOM变化的MutationObserver实例
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                Array.from(mutation.addedNodes).forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList.contains('ReactModalPortal') || node.classList.contains('ChatPageDisclaimer_warningBanner__fcCz9')) {
                            // 删除具有ReactModalPortal类的div元素
                            node.remove();
                        } else {
                            // 检查子元素是否具有ReactModalPortal类的div元素
                            const reactModalPortal = node.querySelector('.ReactModalPortal');
                            if (reactModalPortal) {
                                // 删除具有ReactModalPortal类的div元素
                                reactModalPortal.remove();
                            }else{
                                var wnb = node.querySelector('ChatPageDisclaimer_warningBanner__fcCz9');
                                if(wnb) wnb.remove();
                            }
                        }
                    }
                    classfilter(node);
                    codefilter(node);
                });
            }
        });
    });

    // 开始观察整个文档的DOM变化
    observer.observe(document, {
        childList: true,
        subtree: true,
    });

    // 当不再需要观察DOM变化时，调用disconnect方法停止观察
    // observer.disconnect();
}

function pasteFromClickBoard(inputarea){
navigator.clipboard.readText()
  .then(text => {
      inputarea.textContent = text;
      inputarea.focus();
      inputarea.setSelectionRange(inputarea.value.length, inputarea.value.length);
      inputarea.scrollTop = inputarea.scrollHeight;
      inputarea.focus();
  })
  .catch(err => {
  });
}

function run() {
    cleanpage();
    setTimeout(function(){
        classfilter(document);
        codefilter(document);

        // poe.com打开网页默认鼠标不是聚焦在输入框，需要用鼠标点击输入框
        // 进行聚焦再输入，这里自动聚焦输入框，避免鼠标操作
        var input = document.querySelector("textarea");
        input.setAttribute("rows", 3);
        pasteFromClickBoard(input);
    }, 500);
    setTimeout(function(){
        var e = document.querySelector("#__next > div > div > aside > div > header > a");
        if(e) e.addEventListener("click", function(event) {
            event.preventDefault(); // 阻止默认行为，即打开链接
            // 这里添加您想要执行的代码
            copy();
        });
    }, 1000);
};

window.onload = run;
