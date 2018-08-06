$(function () {
    firstLoadInit();
    loadingInit();
    validateInit();
});

function firstLoadInit() {
    console.log('base.js loaded');
}

// called from validate.js
function createTempList() {
    var count = 0;
    $(ConfigXml).contents().each(function processNodes() {
        
        


        // if type is page, process it

        if (this.nodeType == 3) {
            var trimmed = $.trim(this.wholeText);
            if (trimmed) {
                // it's actually pure text
            }
        } else {
            if (this.nodeName == "text") {
                var str = "<div class='" + this.nodeName + "'>" + this.textContent + "</div>";
                $("#tempXml").append(str);
                $(this).contents().each(processNodes);
            } else {
                var str = "<div class='" + this.nodeName + "'>" + this.nodeName + "</div>";
                $("#tempXml").append(str);
                $(this).contents().each(processNodes);
            }
        }
        
    });
}

function getObject(element) {
    
    var ob = {
        Id: $(element).prop('id'),
        Type: element.nodeName,
        Name: $(element).prop('name') || "",
        Margin: 0
    };

}