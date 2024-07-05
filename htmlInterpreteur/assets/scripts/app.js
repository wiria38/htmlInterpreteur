const editor = document.getElementById("text-writer");
const lineEditor = document.getElementById("line");
const resizer = document.getElementById('resizer');
const iframeResult = document.getElementById("iframeResult");
const isActiveAutoRun = document.getElementById("isActiveAutoRun");
const timeOutValue = document.getElementById("timeOutValue");
const resultDiv = document.getElementById("result");
let numLine = document.getElementsByClassName("NumLine");

function countLines(text) {
    return text.split('\n').length;
}


var runAutoLoad = 0;
var lastLineCount = 1;
let timeout = null;
let isResizing = false;

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

function clearDoc(){
    iframeResult.srcdoc = "";
}


function clearCode(){
    editor.value = "";
    correctNumLine(numLine, 1);
}


function reziseUpdate(e){
    isResizing = true;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    iframeResult.style.display = "none";
}




resizer.addEventListener('mousedown', function(e) {
    reziseUpdate(e);
});

function onMouseMove(e) {
    if (!isResizing) return;

    const offsetRight = document.body.offsetWidth - (e.clientX - document.body.offsetLeft);
    editor.style.width = `${ window.innerWidth - offsetRight - 35}px`;
    console.log(editor.style.width);


    //editor.style.width = `calc(100vw - ${offsetRight + resizer.offsetWidth}px - 30px)`;
}

function onMouseUp() {
    isResizing = false;
    document.body.style.cursor = 'default';
    iframeResult.style.display = "flex";
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}




editor.addEventListener("input", ()=>{
    if(checkNumLine(lastLineCount, countLines(editor.value))){
        lastLineCount = countLines(editor.value);
        correctNumLine(numLine, countLines(editor.value));
    }


    if (timeout) {
        clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
        if (runAutoLoad) {
            iframeResult.srcdoc = editor.value;
        }
    }, (timeOutValue.value * 1000));
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

document.getElementById("timeOutDelay").addEventListener("click", function() {
    timeOutValue.click();
});