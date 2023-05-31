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
        return element.textContent.trimRight();
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
                const parentTagName = element.parentElement.tagName.toLowerCase();
                return parentTagName === 'ol' ? `${index}. ${children.trim()}\n` : `* ${children.trim()}\n`;
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

    var userdiv = document.querySelector("#__next > div.PageWithSidebarLayout_centeringDiv___L9br > div > section > div.PageWithSidebarLayout_scrollSection__IRP9Y.PageWithSidebarLayout_startAtBottom__wKtfz > div > div > div.InfiniteScroll_container__kzp7X.ChatMessagesView_infiniteScroll__K_SeP > div:nth-last-child(1) > div:nth-child(1)> div.ChatMessage_messageWrapper__Zf87D > div.Message_row___ur0Y > div.Message_humanMessageBubble__Nld4j > div");
    var gptdiv = document.querySelector("#__next > div.PageWithSidebarLayout_centeringDiv___L9br > div > section > div.PageWithSidebarLayout_scrollSection__IRP9Y.PageWithSidebarLayout_startAtBottom__wKtfz > div > div > div.InfiniteScroll_container__kzp7X.ChatMessagesView_infiniteScroll__K_SeP > div:nth-last-child(1) > div:nth-child(2) > div.ChatMessage_messageWrapper__Zf87D > div.Message_row___ur0Y > div.Message_botMessageBubble__CPGMI > div");

    var textarea = document.createElement("textarea");
    textarea.style.opacity = 0;
    document.body.appendChild(textarea);

    var usercontent = extractText(userdiv);
    var gptcontent = extractText(gptdiv);
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

function run() {
    var e = document.querySelector("#__next > div.PageWithSidebarLayout_centeringDiv___L9br > div > aside > div > header > a");
    e.addEventListener("click", function(event) {
        event.preventDefault(); // 阻止默认行为，即打开链接
        // 这里添加您想要执行的代码
        copy();
    });
    cleanpage();
};

window.onload = run;
