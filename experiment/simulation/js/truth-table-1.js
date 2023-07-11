let dict = {};
dict[3] = [42, 1, 1, 0, 0]; // 42 is a placeholder
dict[4] = [42, 1, 1, 0, 1];
dict[5] = [42, 1, 1, 0, 1];

let cor = document.getElementById('correct');
let inc = document.getElementById('incorrect');

function checkColumn (column) {
    // cell = column_row
    let sum = 0;
    for (let row = '1'; row <= '4';  row++) {
        cell_id = column + '_' + row;
        sum += (document.getElementById(cell_id).value == dict[column][row]);
    }

    if (sum === 4) {
        cor.classList.remove('is-hidden');
        inc.classList.add('is-hidden');
        for (let row = '1'; row <= '5';  row++) {
            cell_id = column + '_' + row;
            document.getElementById(cell_id).disabled = true;
        }

        if(column !== 5) {
            setTimeout(()=>{cor.classList.add('is-hidden')},'1500');
            nxt = 1 + column;
            for (let row = '1'; row <= '5';  row++) {
                cell_id = nxt + '_' + row;
                document.getElementById(cell_id).disabled = false;
            }
        }
        else {
            document.getElementById('next').classList.remove('is-hidden');
        }
    }

    else {
        cor.classList.add('is-hidden');
        inc.innerHTML = (4 - sum) + ' value(s) are incorrect.';
        inc.classList.remove('is-hidden');
    }
}

function reset() {
    let bits = document.getElementsByClassName('bit');
    for(let i = 0; i < bits.length; i++) {
        bits[i].value = "";
    }

    for (let row = '1'; row <= '5';  row++) {
        cell_id = '3_' + row;
        document.getElementById(cell_id).disabled = false;
        for(let col = '4'; col <= '5'; col++) {
            cell_id = col + '_' + row;
            document.getElementById(cell_id).disabled=true;
        }
    }
    cor.classList.add('is-hidden');
    inc.classList.add('is-hidden');
}

reset()