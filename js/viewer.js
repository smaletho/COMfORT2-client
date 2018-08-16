var pageXml;
var resizeTimer;

$(function () {
    $("#offline-load").css('display', 'table');

    // load the file
    $("#page-file").on('change', function () {
        if ($("#page-file").val()) {

            $("#loading").show();
            updateLoadingText('Loading file');

            var file = $("#page-file").prop('files')[0];
            var fr = new FileReader();
            fr.onload = function () {
                updateLoadingText('Received file, parsing data');
                pageXml = $.parseXML(this.result);
                pageReceived_Render();
            };
            fr.onerror = function () {
                updateLoadingText('There was an error');
            }
            fr.readAsText(file);
        }
    });

    // keep aspect ratio
    maintainAspectRatio();

    $(window).on('resize', function (e) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            maintainAspectRatio();
        }, 1000);
    });


});

function pageReceived_Render() {
    $("#page-content").empty();
    appendStandardContent();

    // targetPage.content should be just the file contents from above
    $(pageXml).contents().contents().each(function recursivePageLoad() {

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
    renderInit();
    $("#loading").hide();
}