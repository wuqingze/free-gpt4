function extractText(element) {
    if (!element) {
        return '';
    }
    if (element.nodeType === Node.TEXT_NODE) {
        return element.textContent;
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
                const parentTagName = element.parentElement.tagName.toLowerCase();
                return parentTagName === 'ol' ? `1. ${children}\n` : `* ${children}\n`;
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
                return `${children}`;
            case 'pre':
                var lng = element.parentNode.firstChild.firstChild.textContent;
                return "```"+lng+"\n" + `${children}` + "```\n";
            case 'blockquote':
                return `> ${children}\n`;
            case 'a':
                const href = element.getAttribute('href');
                return `[${children}](${href})`;
                // Add more cases for other HTML tags as needed
            default:
                return children;
        }
    }

    return '';
}

function traverse(container, textarea, isuser ){
    // 遍历container中的所有子元素
    for (let node of container.childNodes) {
        // 如果当前节点是<p>元素，则提取文本内容
        if (node.nodeName === "P") {
            const text = node.textContent.trim();
            /**
            if(textarea.value === "") textarea.value = text;
            else
                textarea.value = textarea.value+"\n\n"+text;
             **/
            textarea.value = textarea.value+text+"\n\n";
            console.log("Found <p> element with text: ", text);
        }
        // 如果当前节点是<div>元素，则遍历其子元素
        else if (node.nodeName === "DIV") {
            let preNode = null;
            let languageNode = null;

            for (let childNode of node.childNodes) {
                if (childNode .classList.contains("MarkdownCodeBlock_codeHeader__5MZpO")) {
                    languageNode = childNode; 
                    continue;
                }
                // 如果子节点是<pre>元素，则记录下来
                if (childNode.nodeName === "PRE") {
                    preNode = childNode;
                }
            }

            if(languageNode !== null){
                var tdiv = languageNode.querySelector('div');
                textarea.value = textarea.value+"```"+tdiv.textContent.trim()+"\n";;
            }
            // 如果存在<pre>元素，则遍历其子节点
            if (preNode !== null) {
                for (let codeNode of preNode.childNodes) {
                    // 如果子节点是<code>元素，则提取其文本内容并输出
                    if (codeNode.nodeName === "CODE") {
                        const text = codeNode.textContent.trim();
                        textarea.value = textarea.value+text+"\n```\n\n";
                        console.log("Found <code> element with text: ", text);
                    }
                }
            }
        }
    }
    if(isuser){
        textarea.value += "###ChatGPT\n";
    }else{
        textarea.value += "###User\n";
    }
}

var userdiv = document.querySelector("#__next > div.PageWithSidebarLayout_centeringDiv___L9br > div > section > div.PageWithSidebarLayout_scrollSection__IRP9Y.PageWithSidebarLayout_startAtBottom__wKtfz > div > div > div.InfiniteScroll_container__kzp7X.ChatMessagesView_infiniteScroll__K_SeP > div:nth-last-child(1) > div:nth-child(1)> div.ChatMessage_messageWrapper__Zf87D > div.Message_row___ur0Y > div.Message_humanMessageBubble__Nld4j > div");
var gptdiv = document.querySelector("#__next > div.PageWithSidebarLayout_centeringDiv___L9br > div > section > div.PageWithSidebarLayout_scrollSection__IRP9Y.PageWithSidebarLayout_startAtBottom__wKtfz > div > div > div.InfiniteScroll_container__kzp7X.ChatMessagesView_infiniteScroll__K_SeP > div:nth-last-child(1) > div:nth-child(2) > div.ChatMessage_messageWrapper__Zf87D > div.Message_row___ur0Y > div.Message_botMessageBubble__CPGMI > div");

var textarea = document.createElement("textarea");
textarea.style.opacity = 0;
document.body.appendChild(textarea);

//traverse(userdiv, textarea, true);
//traverse(gptdiv, textarea, false);
textarea.value += extractText(userdiv);
textarea.value += "**ChatGPT**\n";
textarea.value += extractText(gptdiv);
textarea.value += "**User**\n";
if(textarea.value.startsWith("**User**")) {
}else{
    textarea.value = "**User**\n"+textarea.value;
}
// 选择textarea中的文本
textarea.select();

// 将文本复制到系统剪贴板中
document.execCommand("copy");

// 删除textarea元素
document.body.removeChild(textarea);
