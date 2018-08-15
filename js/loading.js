function loadingInit() {
    console.log('loading.js init');
}


function renderInit() {
    $(".navigateTo").on('click', function () {
        loadPage($(this).data('id'), "page");
        return false;
    });

    $(".definitionPopup").on('click', function () {
        var pos = $(this).offset();


        $("#definitionWindow").css('top', (pos.top - 50) + "px");
        $("#definitionWindow").css('left', pos.left + "px");

        $("#definitionWindow").show();
        $("#definitionWindow").text($(this).data('text'));
        return false;
    });

    $("#page-content").on('click', function () {
        $("#definitionWindow").hide();
        $("#definitionWindow").css('top', '0');
        $("#definitionWindow").css('left', '0');
        $("#definitionWindow").text('');
    });
}

function renderElement(element) {
    switch (element.nodeName) {
        case "text": 
            var node = textNode(element);
            $("#page-content").append(node);
            break;
        case "image":
            var node = imageNode(element)
            $("#page-content").append(node);
            break;;
    }
}

function imageNode(element) {
    var newNode = $("<img></img>");
    $(newNode).addClass("item");

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
            case "width": {
                $(newNode).width(element.attributes[i].value);
                break;
            }
            case "height": {
                $(newNode).height(element.attributes[i].value);
                break;
            }
            case "class": {
                var classes = element.attributes[i].value.split(' ');
                for (var ii = 0; ii < classes.length; ii++) {
                    $(newNode).addClass(classes[ii]);
                }
                break;
            }
            case "source": {
                $(newNode).prop('src', element.attributes[i].value);
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
            case "width": {
                $(newNode).width(element.attributes[i].value);
                break;
            }
            case "height": {
                $(newNode).height(element.attributes[i].value);
                break;
            }
            case "class": {
                var classes = element.attributes[i].value.split(' ');
                for (var ii = 0; ii < classes.length; ii++) {
                    $(newNode).addClass(classes[ii]);
                }
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
        var block = styleArr[i].split(':');
        $(element).css(block[0], block[1]);
    }
    return element;
}






