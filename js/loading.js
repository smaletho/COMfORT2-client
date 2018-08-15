function loadingInit() {
    console.log('loading.js init');
}




function renderElement(element) {
    switch (element.nodeName) {
        case "text": 
            var node = textNode(element);
            $("#page-content").append(node);
            break;
    }
}


function textNode(element) {
    var newNode = $("<div></div>");
    $(newNode).addClass("item");
    $(newNode).addClass('inner-text');
    $(newNode).html($(element).html().trim());
    for (var i = 0; i < element.attributes.length; i++) {
        switch (element.attributes[i].nodeName) {
            case "position-x": {
                $(newNode).css('left', element.attributes[i].value + "px")
                break;
            }
            case "position-y": {
                $(newNode).css('top', element.attributes[i].value + "px")
                break;
            }
            case "style": {
                newNode = textStyleMap(newNode, element.attributes[i].value);
                break;
            }
            default:
                var a = element.attributes[i];
                var b = 0;
                break;
        }
    }
    return newNode;
}

function textStyleMap(element, styles) {
    var styleArr = styles.split(';');
    for (var i = 0; i < styleArr.length; i++) {
        switch (styleArr[i]) {
            case "bold":
                $(element).addClass('bold');
                break;
            case "italics":
                $(element).addClass('italics')
                break;
        }
    }
    return element;
}






