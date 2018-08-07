function validateInit() {
    console.log('validate.js loaded');

    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('The File APIs are not fully supported in this browser.');
        return;
    }

    // confirm valid xml (config.xml)
    // todo: look into WebWorkers to speed this up

}

