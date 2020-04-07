let results = localStorage.getItem('results15') == undefined?null: JSON.parse(localStorage.getItem('results15'));

let puzzleNow;
let size = 4;
let blocksArray;
let mode = 'stop';
let time = 0;
let timeStart;
let moveCount = 0;
let emptyPosition;
let resultsDom;

function  createDocument() {
    header = document.createElement("header");
    header.className = 'header';
    header.id = 'header';

    buttons = document.createElement("div");
    buttons.className = 'buttons';
    buttons.id = 'buttons';

    buttons.innerHTML =
    `<div class="button" id="startButton">Новая игра</div>
    <div class="button" id="pauseButton">${mode == 'stop'? 'Пауза':'Продолжить'}</div>
    <div class="button" id="saveButton">Сохранить</div>
    <div class="button" id="resultsButton">Результаты</div>`;


    info = document.createElement("div");
    info.className = 'info';
    let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((time % (1000 * 60)) / 1000);
    info.innerHTML =
    `<label class="labelText">Ходов:</label>
    <label class="labelValue" id="moveCountValue">${moveCount}</label>
    <label class="labelText">Время:</label>
    <label class="labelValue" id="timeValue">${minutes}:${seconds}</label>`;

    field = document.createElement("main");
    field.id = 'field';

    resultsDom =  document.createElement("div");
    resultsDom.className = 'resultsBG';
    resultsDom.innerHTML =`
    <div class='table'>
        <div class='tableButton'>
            <div class='congratulations' id='congratulations'></div>
            <input type="button" onclick='closeResults()' value='X'>
        </div>
        <div class='table__content'>
            <div class='table__part' id="tableLeftPart">
               
            </div>
            <div class='table__part' id='tableRightPart'>
            
            </div>
        </div>
    </div>
    `;

    pauseText = document.createElement("div");
    pauseText.className = 'pauseText';
    pauseText.innerText = 'pause';

    fieldSizeSelect = document.createElement("select");
    fieldSizeSelect.addEventListener('change', function () {
        changeSize(fieldSizeSelect.value);
    });

    for(let i = 3; i <= 8; i++ ){
        let option = document.createElement("option");
        if(i == size){
            option.selected = true;
        }
        option.innerText = `${i}x${i}`;
        option.value = i + '';
        fieldSizeSelect.appendChild(option);
    }

    buttons.appendChild(fieldSizeSelect);
    header.appendChild(buttons);
    header.appendChild(info);
    body.appendChild(header);
    body.appendChild(field);
    body.appendChild(pauseText);
    body.appendChild(resultsDom);

    buttons.addEventListener('click', function (event) {
        let target = event.target;
        switch (target.id) {
            case 'startButton':
                startGame();
                break;
            case 'pauseButton':
                pauseStart();
                break;
            case 'saveButton':
                save();
                break;
            case 'resultsButton':
                showResults();
                break;
        }
    });

    field.onmousedown = function (event) {
        let target = event.target;
        if(target.id != 'field' && mode == 'start' && event.which == 1) {
            let posMouseDownX = event.clientX;
            let posMouseDownY = event.clientY;

            let positionNow = Number.parseInt(target.id);
            let newPosition = Number.parseInt(emptyPosition);
            let block = blocksArray[target.id];
            let blockHeight = field.offsetWidth / size;

            let changePosition = function () {
                target.style.transition = 'top  0.2s linear, left 0.2s linear';
                document.onmousemove = null;
                document.onmouseup = null;
                moveCount ++;
                document.getElementById('moveCountValue').innerText = moveCount;
                emptyPosition = target.id;
                target.id = newPosition;
                blocksArray[target.id] = block;
                blocksArray[emptyPosition] = null;
                target.style.left = block.x * blockHeight + header.offsetLeft + header.offsetWidth * 0.05 + 'px';
                target.style.top = block.y * blockHeight + header.offsetTop + header.offsetHeight + 'px';
                isFinished();
            };

            if (positionNow + 1 == newPosition && block.x < size - 1) {
                document.onmouseup = function () {
                    block.x++;
                    changePosition();
                };
                document.onmousemove = function (event1) {
                    target.style.transition = 'top  0.0s linear, left 0.0s linear';
                    let newPosMouseX = event1.clientX;
                    let distance = newPosMouseX - posMouseDownX;
                    distance = distance > 0? distance < blockHeight + 1 ? distance : blockHeight : 0;
                    target.style.left = block.x * blockHeight + header.offsetLeft + header.offsetWidth * 0.05  + distance + 'px';
                };

            } else if (positionNow - 1 == newPosition && block.x > 0) {
                document.onmouseup = function () {
                    block.x--;
                    changePosition();
                };
                document.onmousemove = function (event1) {
                    target.style.transition = 'top  0.0s linear, left 0.0s linear';
                    let newPosMouseX = event1.clientX;
                    let distance = posMouseDownX - newPosMouseX;
                    distance = distance > 0? distance < blockHeight + 1 ? distance : blockHeight : 0;
                    target.style.left = block.x * blockHeight + header.offsetLeft + header.offsetWidth * 0.05  - distance + 'px';
                };



            } else if (positionNow + size == newPosition) {
                document.onmouseup = function () {
                    block.y++;
                    changePosition();
                };
                document.onmousemove = function (event1) {
                    target.style.transition = 'top  0.0s linear, left 0.0s linear';
                    let newPosMouseY = event1.clientY;
                    let distance = newPosMouseY - posMouseDownY;
                    distance = distance > 0? distance < blockHeight + 1 ? distance : blockHeight : 0;
                    target.style.top = block.y * blockHeight + header.offsetTop + header.offsetHeight + distance + 'px';
                };

            } else if (positionNow - size == newPosition) {
                document.onmouseup = function () {
                    block.y--;
                    changePosition();
                };
                document.onmousemove = function (event1) {
                    target.style.transition = 'top  0.0s linear, left 0.0s linear';
                    let newPosMouseY = event1.clientY;
                    let distance = posMouseDownY - newPosMouseY;
                    distance = distance > 0? distance < blockHeight + 1 ? distance : blockHeight : 0;
                    target.style.top = block.y * blockHeight + header.offsetTop + header.offsetHeight - distance + 'px';
                };
            }
        }
    };

}

function changeSize(n){
    clearTimer();
    size = Number.parseInt(n);
    pauseStart('stop');
    createBlocksArray();
    createField();
}

function createBlocksArray(){
    blocksArray = {};
    for(let i = 0, k = 0; i < size; i++){
        for(let j = 0; j < size && k < size * size - 1 ; j++, k++){
            let value = i * size + j + 1;
            blocksArray[value] = {x:j, y:i, value:value};
        }
    }
    blocksArray[size * size] = null;

}

function createField() {
    field.innerHTML = '';
    field.style.height = field.offsetWidth + 'px';
    let blockHeight = field.offsetWidth / size;
    for(let i = 0; i < size ; i++ ) {
        for (let j = 0; j < size ; j++) {
            if(blocksArray[i * size + j + 1] != null) {
                let blockInArray = blocksArray[i * size + j + 1];
                let block = document.createElement('div');
                block.className = 'block';
                block.innerText = blockInArray.value;
                block.id = i * size + j + 1 + '';
                block.style.height = blockHeight - 3 + 'px';
                block.style.width = blockHeight - 3 + 'px';
                block.style.fontSize = blockHeight * 0.66 + 'px';
                block.style.top = blockInArray.y * blockHeight + header.offsetTop + header.offsetHeight + 'px';
                block.style.left = blockInArray.x * blockHeight + header.offsetLeft + header.offsetWidth * 0.05 + 'px';
                block.style.zIndex = blockInArray.value + 10 + '';

                field.appendChild(block);
            }
        }
    }
    pauseText.style.top = field.offsetTop + field.offsetWidth*0.37 + 'px';
    pauseText.style.fontSize = field.offsetWidth*0.2 + 'px';
    pauseText.style.left = field.offsetLeft + field.offsetWidth*0.19 + 'px';

}

function startGame() {
    clearTimer();
    createBlocksArray();
    pauseStart( 'start');
    localStorage.removeItem( 'puzzleNow');
    let aimArray = [];
    for(let i = 1; i < size * size ; i++){
        aimArray.push(i);
    }
    for(let i = 0, k = 0; i < size ; i++ ) {
        for (let j = 0; j < size && k < size * size - 1; j++, k++) {
            let rand =  Math.floor(Math.random() * (aimArray.length));
            blocksArray[i * size + j + 1].value = aimArray[rand];
            aimArray.splice(rand,1);
        }
    }

    checkNormalField();
    createField();
    emptyPosition = size * size;
    timerInterval();
}

function checkNormalField(){
  let array = [];
    for(let i = 0, k = 1; i <size ; i++){
        let subArray = [];
        for(let j = 0; j < size; j++, k++){
            subArray.push(blocksArray[k]);
        }
        array.push(subArray);
    }
    let wrongCount = 0;

    for(let i = 0 ; i < array.length; i++){
        for(let j = 0 ; j < array[i].length - 1; j++){
            for(let k = j+1 ; k < array[i].length ; k++){
                if(array[i][j] != null && array[i][k] != null && array[i][j].value > array[i][k].value){
                    wrongCount ++;
                }
            }
        }
    }
    if(wrongCount % 2 != 0 ){
        let block = array[0][size-1].value;
        array[0][size-1].value = array[0][size-2].value;
        array[0][size-2].value = block;
    }
    wrongCount = 0;
    for(let i = 0 ; i < array.length; i++){
        for(let j = 0 ; j < array[i].length - 1; j++){
            for(let k = j+1 ; k < array[i].length ; k++){
                if(array[i][j] != null && array[i][k] != null && array[i][j].value > array[i][k].value){
                    wrongCount ++;
                }
            }
        }
    }
}

function pauseStart(newMode) {
    if(newMode == undefined){
        mode = mode == 'stop'?mode:mode == 'start'? 'pause': 'start';
    }else{
        mode = newMode;
    }
    if(mode == 'pause'){
        field.style.display = 'none';
        pauseText.style.display = 'block';
        document.getElementById('pauseButton').innerText = 'Старт';
    }
    else if(mode == 'start'){
        timerInterval();
        field.style.display = 'block';
        pauseText.style.display = 'none';
        document.getElementById('pauseButton').innerText = 'Пауза';
    }
}

function timerInterval() {
    timeStart = new Date().getTime();
    let timer = setInterval(function () {
        if(mode != 'start'){
            time += new Date().getTime() - timeStart;
            clearInterval(timer);
        }
        else{
            let distance = new Date().getTime() - timeStart + time;
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);
            document.getElementById("timeValue").innerText = `${minutes} : ${seconds}`;
        }
    },1000);
}

function save() {
    if(mode != 'stop') {
        puzzleNow = {
            blocksArray: blocksArray,
            time: time + new Date().getTime() - timeStart,
            moveCount: moveCount,
            size: size,
            emptyPosition: emptyPosition
        };
        localStorage.setItem('puzzleNow', JSON.stringify(puzzleNow));
    }
}

function showResults() {
    resultsDom.style.display = 'flex';
    let bestTime = document.getElementById('tableLeftPart');
    let bestMove = document.getElementById('tableRightPart');

    bestTime.innerHTML = `<div class='table__header'>Лучшее время</div>`;
    bestMove.innerHTML = `<div class='table__header'>Лучшие ходы</div>`;

    if(results != null){
        for(let i = 0; i < results.bestMove.length ; i++){
            let element = document.createElement("div");
            let minutes = Math.floor((results.bestMove[i].time % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((results.bestMove[i].time % (1000 * 60)) / 1000);

            element.innerText = `Время ${minutes}:${seconds} , Ходы ${results.bestMove[i].move} ${results.bestMove[i].size}x${results.bestMove[i].size}`;
            if(i%2 == 0){
                element.className = 'even';
            }
            bestMove.appendChild(element);
        }
        for(let i = 0; i < results.bestTime.length ; i++){
            let element = document.createElement("div");
            let minutes = Math.floor((results.bestTime[i].time % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((results.bestTime[i].time % (1000 * 60)) / 1000);

            element.innerText = `Время ${minutes}:${seconds}  ,  Ходы ${results.bestTime[i].move} ${results.bestTime[i].size}x${results.bestTime[i].size}`;
            if(i%2 == 0){
                element.className = 'even';
            }
            bestTime.appendChild(element);
        }
    }

}

function isFinished(){
    if(emptyPosition == size * size) {
        let finish = true;
        for (let i = 1; i < size * size - 1 && finish == true; i++) {
          if(blocksArray[i].value != i){
              finish = false;
              break;
          }
        }
        if(finish){
            let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((time % (1000 * 60)) / 1000);
            document.getElementById('congratulations').innerText =
                `Ура! Вы решили головоломку за ${minutes} : ${seconds} и ${moveCount} ходов`;
            writeResults();
            showResults();
            clearTimer();
            pauseStart('stop')
        }
    }
}

function clearTimer() {
    moveCount = 0;
    document.getElementById('moveCountValue').innerText = moveCount;
    time = 0;
    document.getElementById("timeValue").innerText = `0 : 0`;
}

if(localStorage.getItem('puzzleNow')){
    puzzleNow = JSON.parse(localStorage.getItem('puzzleNow'));
    size = puzzleNow.size;
    time = puzzleNow.time;
    moveCount = puzzleNow.moveCount;
    blocksArray = puzzleNow.blocksArray;
    emptyPosition = puzzleNow.emptyPosition;
}

const body = document.querySelector('body');
let header;
let buttons;
let info;
let main;
let field;
let fieldSizeSelect;
let pauseText;

createDocument();

if(puzzleNow == undefined) {
    changeSize(size);
}
else{
    createField();
    pauseStart('pause');
}

window.onresize = function() {
    createField();
};

function closeResults() {
    document.getElementById('congratulations').innerText = '';
    resultsDom.style.display = 'none';
}

function writeResults() {
    if(results == null){
        results = {bestTime:[{time:time, move:moveCount, size:size}],
            bestMove:[{time:time, move:moveCount}]};
    }
    else{
        if(results.bestTime.length < 10){
            results.bestTime.push({time:time, move:moveCount,size:size});
        }
        else{
            let max = 0;
            for(let i = 0; i < results.bestTime.length; i++){
                if(results.bestTime[i].time > results.bestTime[max].time){
                    max = i;
                }
            }
            if(time < results.bestTime[max].time){
                results.bestTime[max] = {time:time, move:moveCount, size:size};
            }
        }
        if(results.bestMove.length < 10){
            results.bestMove.push({time:time, move:moveCount, size:size});
        }
        else{
            let max = 0;
            for(let i = 0; i < results.bestMove.length; i++){
                if(results.bestMove[i].move > results.bestMove[max].move){
                    max = i;
                }
            }
            if(moveCount < results.bestMove[max].move){
                results.bestMove[max] = {time:time, move:moveCount, size:size};
            }
        }
    }
    localStorage.setItem('results15', JSON.stringify(results));
}
