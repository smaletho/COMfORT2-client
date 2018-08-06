function validateInit() {
    console.log('validate.js loaded');

    // confirm valid xml (config.xml)
    // todo: look into WebWorkers to speed this up

}

function testFiles() {

    // Check to make sure we can read files
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('The File APIs are not fully supported in this browser.');
        return;
    }

    // Start with the config file
    input = document.getElementById('config-file');
    if (!input) {
        alert("Um, couldn't find the fileinput element.");
    }
    else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
        alert("Please select a file before clicking 'Load'");
    }
    else {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = function () {
            ConfigXml = $.parseXML(this.result);
            // call to base.js
            createTempList();
        };
        fr.readAsText(file);
    }

    
}

function loadPages() {
    var configPages = 0;

    // Count the number of pages that the config file expects
    var configPages;
    try {
        configPages = $(ConfigXml).find('page');
    } catch {
        alert('Configuration file not loaded');
    }
    

    // Now on to the pages selected
    pageInput = document.getElementById('pages');
    if (!pageInput) {
        alert("Um, couldn't find the fileinput element.");
    }
    else if (!pageInput.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!pageInput.files[0]) {
        alert("Please select a file before clicking 'Load'");
    }
    else {
        for (var i = 0; i < pageInput.files.length; i++) {
            file = pageInput.files[i];
            fr = new FileReader();
            fr.onload = function () {
                try {
                    var content = $.parseXML(this.result);
                    PageArray.push({
                        Id: content.all[0].attributes['id'].value,
                        Name: content.all[0].attributes['name'].value,
                        Content: content
                    });

                    if (PageArray.length == configPages.length) {
                        alert('loaded all');
                        validateMatchups();
                    }
                } catch (err) {
                    alert('Error loading page');
                }
                
            };
            fr.readAsText(file);
        }
    }
}

function validateMatchups() {
    // Check that all pages in config are found and loaded
    var errorsInMatching = false;

    // quickly grab all 'Id' from the array for more validation
    $(ConfigXml).find('page').each(function () {
        // get the id that the config expects
        var id = $(this).prop('id');

        // see if that id is in the array of page content
        var elementPos = PageArray.map(function (x) { return x.Id; }).indexOf(id);
        var objectFound = PageArray[elementPos];
        if (!objectFound) {
            errorsInMatching = true;
            console.log("Couldn't find page: " + id);
        }
    });

    if (errorsInMatching) {
        alert('There was an error validating the book content. Check the console.');
    } else {
        alert("All the files match");
        createTempList();
    }
}