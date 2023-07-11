let activeExpl = 0;

function show_expl(x) {
    hide_expl(activeExpl);
    activeExpl = x;
    id = "expl" + x;
    document.getElementById(id).style.display = "block";
}

function hide_expl(x) {
    id = "expl" + x;
    document.getElementById(id).style.display = "none";
}

// document.body.addEventListener('mousedown', () => hide_expl(1)); 