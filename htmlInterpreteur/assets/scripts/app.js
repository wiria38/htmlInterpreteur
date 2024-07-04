const editor = document.getElementById("text-writer");
const lineEditor = document.getElementById("line");
const iframeResult = document.getElementById("iframeResult");
const isActiveAutoRun = document.getElementById("isActiveAutoRun");
let numLine = document.getElementsByClassName("NumLine");

function countLines(text) {
    return text.split('\n').length;
}


var runAutoLoad = 0;
var lastLineCount = 1;

function checkNumLine(nbLastLine, nbCurrentLine){
    if(nbLastLine === nbCurrentLine)
        return 0
    else
        return 1
}

function correctNumLine(lineElements, nbLine) {
    while (lineElements.length > nbLine) {
        lineElements[lineElements.length - 1].remove();
    }
    while (lineElements.length < nbLine) {
        let span = document.createElement('span');
        span.classList.add("NumLine");
        span.textContent = lineElements.length + 1;
        document.getElementById("line").append(span);
    }
}



editor.addEventListener("input", ()=>{
    if(checkNumLine(lastLineCount, countLines(editor.value))){
        lastLineCount = countLines(editor.value);
        correctNumLine(numLine, countLines(editor.value));
    }

    if(runAutoLoad){
        iframeResult.srcdoc = editor.value;
    }

});


editor.addEventListener("scroll", ()=>{
    lineEditor.scrollTop = editor.scrollTop;
});


editor.addEventListener("keydown", function(event) {
    if (event.key === "Tab") {
        event.preventDefault(); // Empêche le comportement par défaut (passer à l'élément suivant)

        // Récupère la position du curseur dans le textarea
        const start = editor.selectionStart;
        const end = editor.selectionEnd;

        // Insère une tabulation à la position du curseur
        const tab = '    '; // Vous pouvez ajuster la taille de la tabulation ici
        const text = editor.value;
        editor.value = text.substring(0, start) + tab + text.substring(end);

        // Replace le curseur après la tabulation insérée
        editor.selectionStart = editor.selectionEnd = start + tab.length;
    }
});


iframeResult.addEventListener('load', ()=>{
    const iframeTitle = iframeResult.contentDocument.title;
    const Frametitle = document.getElementById('Frametitle');
    if(iframeTitle == "")
        Frametitle.textContent = "No Title";

    Frametitle.textContent = iframeTitle ? "Title: " + iframeTitle : "No Title";
});

function loadDoc(){
    iframeResult.srcdoc = editor.value;
}

function autoLoadDoc(){
    runAutoLoad = 1;
    isActiveAutoRun.textContent = "Auto Run Enable";
    isActiveAutoRun.style.background = "green";
}

function stopAutoLoadDoc(){
    runAutoLoad = 0;
    isActiveAutoRun.textContent = "Auto Run Disable";
    isActiveAutoRun.style.background = "red";
}