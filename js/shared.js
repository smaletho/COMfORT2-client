function blankTextNode(element) {
    // This should never happen.
    //  It would be XML outsite of an element
    //  I had to check several times, so I moved it here
    //
    //  ex:     <chapter>
    //              <page>
    //                  <text>Good text here</text>
    //                  Bad text here
    //              </page>
    //          </chapter>
    //
    //  return true --> BAD
    //  return false --> GOOD



    if (element.nodeType == 3) {
        var trimmed = $.trim(element.wholeText);
        if (trimmed == "") {
            // it's actually pure text outside of 
            //  I'm pretty sure we'll never hit here
            return true;
        }
    }
    return false;
}



function maintainAspectRatio() {
    // the "17" is due to padding and stuff
    var maxHeight = window.innerHeight - 18;
    var maxWidth = window.innerWidth - 18;
    var srcHeight = $("#main-window").height();
    var srcWidth = $("#main-window").width();

    ScaleRatio = calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight);
    console.log("Set scale", ScaleRatio);

    $("#main-window").css({
        '-webkit-transform': 'scale(' + ScaleRatio + ')',
        '-moz-transform': 'scale(' + ScaleRatio + ')',
        '-ms-transform': 'scale(' + ScaleRatio + ')',
        '-o-transform': 'scale(' + ScaleRatio + ')',
        'transform': 'scale(' + ScaleRatio + ')'
    });

    $("#main-window").css('margin-left', '0');

}


function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {

    return Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
}


