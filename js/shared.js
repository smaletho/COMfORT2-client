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


