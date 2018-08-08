function loadingInit() {
    console.log('loading.js init');
}


function nextPage() {
    // CurrentLocation
    var allPages = $(ConfigXml).find('page');

    for (var i = 0; i < allPages.length; i++) {
        if ($(allPages[i]).prop('id') == CurrentLocation.Page) {
            if ((i + 1) >= allPages.length) {
                alert("you're off the edge");
            } else {
                loadPage($(allPages[i+1]).prop('id'));
            }
            break;
        }
    }
}
function previousPage() {
    var allPages = $(ConfigXml).find('page');

    for (var i = 0; i < allPages.length; i++) {
        if ($(allPages[i]).prop('id') == CurrentLocation.Page) {
            if ((i - 1) < 0) {
                alert("you're off the edge");
            } else {
                loadPage($(allPages[i - 1]).prop('id'));
            }
            break;
        }
    }
}

function loadPage(id) {
    if (typeof id === "undefined") {
        // load the first page of the module
        var newId = $(ConfigXml).find('page').first().prop('id');
        loadPage(newId);
    } else {
        var page = PageContent.find(x => x.Page === id);

        // if page has content
        $("#page-content").empty();

        var previousLocation = CurrentLocation;
        CurrentLocation = page;
        console.log(CurrentLocation);

        updateNavigation(previousLocation);

        $(page.content).contents().each(function recursivePageLoad() {
            
            if (!blankTextNode(this)) {
                var innerPage = $(this).html().trim();

                if ((innerPage.indexOf('<text>') == -1) && (innerPage.indexOf('</text>') == -1)) {
                    // this is a normal, empty node

                    renderElement(this);
                } else {
                    // there's text inside, use regex to cut it out
                    // copy this id to make sure the rest is added later
                    alert("I found nodes inside of nodes, and I haven't accounted for that...");
                    //processTextElement(this);
                    //$(this).contents().each(recursivePageLoad);
                }
            }
        });
    }
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



function updateNavigation(previousLocation) {
    // CurrentLocation

    
    var parentChapter = $(ConfigXml).find("#" + CurrentLocation.Page).parent("chapter");

    // set the right TOC thing
    $(".sub-links").hide();

    $(".sub-links[data-id=" + CurrentLocation.Module + "]").show();
    $(".sub-links[data-id=" + CurrentLocation.Section + "]").show();
    $(".sub-links[data-id=" + CurrentLocation.Chapter + "]").show();

    // highlight the active chapter

    
    
    // find the page number within the chapter
    var chapterChildren = $(parentChapter).children("page").map(function () { return this.id }).get();

    // update the page number
    var page = 0;
    for (var i = 0; i < chapterChildren.length; i++) {
        if (chapterChildren[i] == CurrentLocation.Page) {
            page = i + 1;
            break;
        }
    }
    
    var ch_page = $("#pageList").find('.chapter[data-id=' + $(parentChapter).prop('id') + "]").first();
    $(ch_page).find(".pageCounter").first().text(page + "/" + chapterChildren.length);

    if (previousLocation != {}) {
        if (previousLocation.Chapter != CurrentLocation.Chapter) {
            // changing chapters
            $("#pageList .chapter").removeClass('activeChapter');
            $(ch_page).addClass('activeChapter');
        } else {

        }
        if (previousLocation.Section != CurrentLocation.Section) {
            // changing sections
        }
        if (previousLocation.Module != CurrentLocation.Module) {
            // changing modules
        }
    }

    
}

