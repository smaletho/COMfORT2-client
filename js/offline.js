function offlineLoadInit() {
    $("#config-file").on('change', function () {
        if ($("#config-file").val()) {
            var file = $("#config-file").prop('files')[0];
            var fr = new FileReader();
            fr.onload = function () {
                ConfigXml = $.parseXML(this.result);
                processOfflineXml();
            };
            fr.readAsText(file);
        }
    });
}

function processOfflineXml() {
    // replace all "page" nodes with empty ones that reference other objects
    PageContent = [];

    $(ConfigXml).contents().each(function processNodes() {
        
        // check for empty node
        if (blankTextNode(this)) {
            console.log('skipped', $(this).prop('id'));
        } else {
            if (this.nodeName == "page") {
                // I'm cutting out all the stuff page contents when it can be sent from the server
                var id = $(this).prop('id');

                PageContent.push(this.cloneNode());

                // make an empty page piece
                var blankPage = document.createElement("page");
                $(blankPage).prop('id', id);
                this.parentNode.replaceChild(blankPage, this);
                                
            }

            // recurse
            $(this).contents().each(processNodes);
        }

    });

    // process the pages now
    //  to: base.js
    processPages(PageContent);

    buildTableOfContents();
}