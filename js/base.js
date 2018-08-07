$(function () {
    firstLoadInit();
    loadingInit();
    validateInit();

    // load the file offline
    if (true) {
        offlineLoadInit();
    }
});

function firstLoadInit() {
    console.log('base.js loaded');
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
function processPages(pages) {
    // process the content of the pages in the xml
    $(pages).each(function processNodes() {

    });






    $(ConfigXml).contents().each(function processNodes() {

        if (blankTextNode(this)) {
            console.log('skipped', $(this).prop('id'));
        } else {
            if (this.nodeName == "text") {
                
                var content = $(this).html().trim();
                // text elements can contain children, and their html is presented differently
                //      <text>
                //          Stuff here but <text style="bold">this is bold</text>
                //      </text>


                if (content != "") {
                    if ((content.indexOf('<text>') == -1) && (content.indexOf('</text>') == -1)) {
                        // there's text inside, use regex to cut it out
                        // copy this id to make sure the rest is added later

                        processTextElement(this);
                    } else {
                        var div = "<div id='" + $(this).prop('id') + "' class='" + this.nodeName + "'>" + content + "</div>";
                        $("#tempXml").append(div);
                    }
                    

                    $(this).contents().each(processNodes);
                }
            } else {
                var str = "<div id='" + $(this).prop('id') + "' class='" + this.nodeName + "'>" + this.nodeName + "</div>";
                $("#tempXml").append(str);
                $(this).contents().each(processNodes);
            }
        }
    });
}

function processTextElement(element) {
    var text = $(this).html().trim();

}


function buildTableOfContents() {

    // make ConfigXml into an easier to deal with object to generate the 

    console.log('all modules', $(ConfigXml).find('chapter').prop('id'))
}