function initNavigation() {
    unbindNavigation();

    $("#next-button").on('click', nextPage);
    $("#previous-button").on('click', previousPage);

    $(".chapter-item").on('click', function () {
        var id = $(this).data('id');
        loadPage(id, "chapter");
    });
    $(".section-item").on('click', function () {
        var id = $(this).data('id');
        loadPage(id, "section");
    });
}

function unbindNavigation() {
    $("#next-button").unbind();
    $("#previous-button").unbind();
    $(".chapter-item").unbind();
    $(".section-item").unbind();
}


function nextPage() {
    // CurrentLocation
    var allPages = $(ConfigXml).find('page');

    for (var i = 0; i < allPages.length; i++) {
        if ($(allPages[i]).prop('id') == CurrentLocation.Page) {
            if ((i + 1) >= allPages.length) {
                alert("you're off the edge");
            } else {
                loadPage($(allPages[i + 1]).prop('id'), "page");
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
                loadPage($(allPages[i - 1]).prop('id'), "page");
            }
            break;
        }
    }
}
function loadPage(id, type) {
    if (typeof id === "undefined") {
        // load the first page of the module
        var newId = $(ConfigXml).find('page').first().prop('id');
        loadPage(newId, "page");
    } else {

        var targetPage;

        switch (type) {
            case "page":
                // id is already a page
                break;
            case "chapter":
                id = $(ConfigXml).find("#" + id).children("page").first().prop('id');
                
                break;
            case "section":
                id = $(ConfigXml).find("#" + id).children("chapter").first().children("page").first().prop('id');
                
                break;
            case "module":
                id = $(ConfigXml).find("#" + id).children("section").first().children("chapter").first().children("page").first().prop('id');
                
                break;
        }

        $(PageContent).each(function () {
            if (this.Page == id) {
                targetPage = this;
                return false;
            }
        });
        
        
        
        // if page has content
        $("#page-content").empty();

        var previousLocation = CurrentLocation;
        CurrentLocation = targetPage;
        console.log(CurrentLocation);

        updateNavigation(previousLocation);

        $(targetPage.content).contents().each(function recursivePageLoad() {

            if (!blankTextNode(this)) {
                var innerPage = $(this).html().trim();

                if ((innerPage.indexOf('<text>') == -1) && (innerPage.indexOf('</text>') == -1)) {
                    // this is a normal, empty node

                    renderElement(this);
                } else {
                    alert("I found nodes inside of nodes, and I haven't accounted for that...");
                    //processTextElement(this);
                    //$(this).contents().each(recursivePageLoad);
                }
            }
        });
    }
}


function updateNavigation(previousLocation) {

    var parentChapter = $(ConfigXml).find("#" + CurrentLocation.Page).parent("chapter");
    var parentModule = $(ConfigXml).find("#" + CurrentLocation.Page).parent("module");
    var parentSection = $(ConfigXml).find("#" + CurrentLocation.Page).parent("section");

    // check if they're populated
    populateMenus();

    if (typeof previousLocation != "undefined") {

        if (previousLocation.Module != CurrentLocation.Module) {
            // changing modules
            $("#module-name").html('');
            
            $("#section-list").empty();

            $("#page-dot-content").empty();
        }
        if (previousLocation.Section != CurrentLocation.Section) {
            // changing sections
            $("#chapter-list").empty();
            $("#page-dot-content").empty();

            // get all chapters for this section
            $(".section-item").removeClass("selected");
            $(".section-item[data-id=" + CurrentLocation.Section + "]").addClass("selected");
        } if (previousLocation.Chapter != CurrentLocation.Chapter) {
            // changing chapters
            $("#page-dot-content").empty();
            
            $(".chapter-item").removeClass("selected");
            $(".chapter-item[data-id=" + CurrentLocation.Chapter + "]").addClass("selected");
        }

        populateMenus()
    } else {
        // use the first page

        // set default section selected
        $("#section-list").find(".section-item[data-id=" + CurrentLocation.Section + "]").first().addClass("selected");
        $("#chapter-list").find(".chapter-item[data-id=" + CurrentLocation.Chapter + "]").first().addClass("selected");
    }

    updateTableOfContents();
    initNavigation();
    selectPageDots();
    setProgressBar();
}

function setProgressBar() {
    // progress bar width: 
}

function selectPageDots() {
    // set the current page to active
    $(".dot").removeClass("selected");

    $(".dot[data-page='" + CurrentLocation.Page + "']").addClass("selected");
    // set "viewed" pages as darkened
}

function updateTableOfContents() {
    // Update the TOC highlighting and stuff
    $(".sub-links").hide();

    $(".sub-links[data-id=" + CurrentLocation.Module + "]").show();
    $(".sub-links[data-id=" + CurrentLocation.Section + "]").show();
    $(".sub-links[data-id=" + CurrentLocation.Chapter + "]").show();

    // highlight the active chapter in TOC
    $("#pageList .chapter").removeClass('activeChapter');
    $(ch_page).addClass('activeChapter');

    // find the page number within the chapter
    var parentChapter = $(ConfigXml).find("#" + CurrentLocation.Page).parent("chapter");
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
}

function populateMenus() {
    // if module banner is empty
    if ($("#module-name").html() == "") {
        var mod = $(ConfigXml).find("#" + CurrentLocation.Module).first();
        var name = mod[0].attributes.name.value;
        var color = mod[0].attributes.maincolor.value;
        var fontColor = mod[0].attributes.fontcolor.value;

        $("#module-name").html(name);
        $("#top-bar").css('background-color', color);
        $("#module-name").css('color', fontColor);
    }

    // check if there's anything in the box
    if ($('#section-list').is(':empty')) {
        // legit starting from scratch

        // find matching module
        var mod = $(ConfigXml).find("#" + CurrentLocation.Module).first();
        var arr = $(mod).find("section").map(function () {
            return {
                id: this.attributes.id.value,
                name: this.attributes.name.value
            };
        }).get();

        for (var i = 0; i < arr.length; i++) {
            var item = $("<div data-id='" + arr[i].id + "'></div>");
            $(item).addClass('section-item');
            $(item).html(arr[i].name);
            $("#section-list").append(item);
        }
    }

    // check if there's anything in the box
    if ($('#chapter-list').is(':empty')) {
        // legit starting from scratch

        // find matching section
        var sec = $(ConfigXml).find("#" + CurrentLocation.Section).first();
        var arr = $(sec).find("chapter").map(function () {
            return {
                id: this.attributes.id.value,
                name: this.attributes.name.value
            };
        }).get();

        for (var i = 0; i < arr.length; i++) {
            var item = $("<div data-id='" + arr[i].id + "'></div>");
            $(item).addClass('chapter-item');
            $(item).html(arr[i].name);
            $("#chapter-list").append(item);
        }
    }

    // check if the page dots are there
    if ($("#page-dot-content").is(':empty')) {
        // get all pages in this chapter
        var chapter = $(ConfigXml).find("#" + CurrentLocation.Chapter).first();
        var arr = $(chapter).find("page").map(function () {
            return this.attributes.id.value;
        }).get();

        for (var i = 0; i < arr.length; i++) {
            //create a dot, and number it.
            var dot = $("<div data-page='" + arr[i] + "' class='dot'></div>");
            $(dot).html(i + 1);
            $("#page-dot-content").append(dot);
        }
    }
}

