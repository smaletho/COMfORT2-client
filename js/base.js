
var resizeTimer;


$(function () {
    firstLoadInit();
    loadingInit();
    validateInit();

    // load the file offline
    if (true) {
        // when this function finishes, it will call the remaining init
        offlineLoadInit();
    } else {
        secondInit();
    }
});

function secondInit() {
    buildTableOfContents();
    initTocLinks();

    // find the first page, and load it
    //  eventually: check if they left off somewhere
    loadPage();
}

function firstLoadInit() {
    console.log('base.js loaded');


    maintainAspectRatio();

    $(window).on('resize', function (e) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            maintainAspectRatio();
        }, 1000);
    });


    $("#menu-close").on('click', closeNav);
    $("#menu-open").on('click', openNav);
    initNavigation();
}


function initTocLinks() {
    $(".nav-link").on('click', function () {
        // navigate to the page/section/chapter/etc
        var id = $(this).data('id');
        var type = "";

        if ($(this).hasClass("page")) type = "page";
        else if ($(this).hasClass("chapter")) type = "chapter";
        else if ($(this).hasClass("section")) type = "section";
        else if ($(this).hasClass("module")) type = "module";

        loadPage(id, type);

    });



    $(".plusMinus").on('click', function () {
        var id = $(this).data('id');

        // look for the plusMinus
        if ($(this).hasClass("activePlusMinus")) {
            // collapsing
            $(this).text("+");
            $(this).removeClass("activePlusMinus");

            // find class .sub-links with same data-id
            $("#pageList").find('.sub-links[data-id=' + id + ']').first().css('display', 'none');
        } else {
            // expanding
            $(this).text("-");
            $(this).addClass("activePlusMinus");

            // find class .sub-links with same data-id
            $("#pageList").find('.sub-links[data-id=' + id + ']').first().css('display', 'block');
        }


        
        return false;
    });
}







//--------------------------------------
//
//          YO! Read this.
//
// this will happen later, but I already did some work on a similar part (offline)
//  it loops through the xml and processes each node and processes it (recursively)
//      
//  The reason for this is because of how the "text" element works. 
//  It will need to check the inside of the node to see if the node contains children
//      this accounts for things like bold and different colors. 
//
//
//  parameter: pages
//      array of page objects (in dom model)
//
//
//--------------------------------------
//function processPages() {
//    // process the content of the pages in the xml

    
//    $(ConfigXml).contents().each(function processNodes() {

//        if (!blankTextNode(this)) {
//            if (this.nodeName == "text") {

//                var content = $(this).html().trim();
//                // text elements can contain children, and their html is presented differently
//                //      <text>
//                //          Stuff here but <text style="bold">this is bold</text>
//                //      </text>


//                if (content != "") {
//                    if ((content.indexOf('<text>') == -1) && (content.indexOf('</text>') == -1)) {
//                        // there's text inside, use regex to cut it out
//                        // copy this id to make sure the rest is added later

//                        processTextElement(this);
//                    } else {
//                        var div = "<div id='" + $(this).prop('id') + "' class='" + this.nodeName + "'>" + content + "</div>";
//                        $("#tempXml").append(div);
//                    }


//                    $(this).contents().each(processNodes);
//                }
//            } else {
//                var str = "<div id='" + $(this).prop('id') + "' class='" + this.nodeName + "'>" + this.nodeName + "</div>";
//                $("#tempXml").append(str);
//                $(this).contents().each(processNodes);
//            }
//        }
        
//    });
//}


function buildTableOfContents() {

    // make ConfigXml into an easier to deal with object to generate the 

    console.log('all modules', $(ConfigXml).find('chapter').prop('id'))

    // traverse the tree and build the TOC
    var tocHtmlString = "";

    $(ConfigXml).contents().each(function processNodes() {
        // if it's the main book, render different
        if (this.nodeName == "book") {
            // fill in the title
            $("#toc-book-title").text(this.attributes.name.value);

            // recurse
            $(this).contents().each(processNodes);
        } else if (!blankTextNode(this) && this.nodeName != "page") {
            var id = $(this).prop('id');
            var type = this.nodeName;
            var name = this.attributes.name.value;


            tocHtmlString += "<div data-id='" + id + "' class='nav-link " + type + "'>";
            tocHtmlString += "<div class='text'>" + name + "</div>";


            var children = $(this).children();
            

            if (children.length > 0) {
                tocHtmlString += "<div class='plusMinus' data-id='" + id + "'>+</div>";
            }

            tocHtmlString += "</div>";

            
            

            if (this.nodeName == "chapter") {
                // if it's a chapter, update page numbers
                tocHtmlString += "<div class='sub-links pages' data-id='" + id + "'>";

                for (var i = 0; i < children.length; i++) {
                    tocHtmlString += "<div class='nav-link page' data-id='" + children[i].attributes.id.value +"'>" + (i + 1) + "</div>";
                }
            } else {
                tocHtmlString += "<div class='sub-links' data-id='" + id + "'>";
            }

            // recurse
            $(this).contents().each(processNodes);

            // close out the div
            tocHtmlString += "</div>";
        }
    });

    $("#pageList").html(tocHtmlString);

    // subtracting 2 accounts for the border
    $("#toc").height($("#inner-window").height() - 2);
}




function openNav() {
    if ($("#toc").width() == 0) {
        $("#toc").css('width', '33%');
        $("#menu-open").css('margin-left', '33%');
    } else {
        closeNav();
    }
}

function closeNav() {
    $("#toc").width(0);
    $("#menu-open").css('margin-left', '-1px');
}