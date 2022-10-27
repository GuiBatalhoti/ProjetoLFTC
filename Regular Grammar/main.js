var imported = document.createElement('script');
imported.src = './earley-oop.min.js';
document.head.appendChild(imported);

function testGrammar(){
    let rawStates = document.getElementById('regras_gramatica').value.replace(/([A-Z])/g, ' $1');
    let states = rawStates.split(/\r?\n/);
    let testInput = document.getElementById('inputGrammar').value;
    let token = testInput.split('');
    console.log(rawStates);
    console.log(states);
    
    let gramatica = new tinynlp.Grammar(states);

    const raiz = 'S';
    let saida = tinynlp.parse(
        token,
        gramatica,
        raiz
    );
    
    let estado = saida.getFinishedRoot(raiz);

    let input = document.getElementById('inputGrammar');
    mudaCorTeste(input, estado);

}


function mudaCorTeste(inputTest, valorResultado){
    if (valorResultado) {
        inputTest.style.backgroundColor = '#4ef73b';
    }
    else {
        inputTest.style.backgroundColor = '#f52a2a';
    }
}