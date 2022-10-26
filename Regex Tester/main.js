

function regexInput() {

    let inputREGEX = document.getElementById('inputREGEX').value;
    let inputTest01 = document.getElementById('inputTeste01');
    let inputTest02 = document.getElementById('inputTeste02');
  
    if (inputREGEX[0] === '^' && inputREGEX.at(-1) === "$") {
        let re = new RegExp(inputREGEX);
        mudaCorTeste(inputTest01, re.test(inputTest01.value));
        mudaCorTeste(inputTest02, re.test(inputTest02.value));
    }
}


function regexTest() {
    
    let inputREGEX = document.getElementById('inputREGEX').value;
    let inputTest01 = document.getElementById('inputTeste01');
    let inputTest02 = document.getElementById('inputTeste02');
    let re = new RegExp(inputREGEX);
    mudaCorTeste(inputTest01, re.test(inputTest01.value));
    mudaCorTeste(inputTest02, re.test(inputTest02.value));
}


function mudaCorTeste(inputTest, valorRE){
    if (valorRE == true) {
        inputTest.style.backgroundColor = '#4ef73b';
    }
    else {
        inputTest.style.backgroundColor = '#f52a2a';
    }
}
