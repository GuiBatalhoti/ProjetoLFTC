//importando as bibliotecas
var imported = document.createElement('script');
imported.src = './earley-oop.min.js';
document.head.appendChild(imported);

const regex_gramatica_direita = new RegExp("^[A-Z]->([a-z]*|[0-9]*)([A-Z]{0,1})$");

function testGrammar(){
    let states = pegaRegras()

    //pegando o input de teste
    let testInput = document.getElementById('inputGrammar').value;
    let token = testInput.split('');
    
    // biblioteca de gramática
    let gramatica = new tinynlp.Grammar(states);

    // definindo a raiz
    const raiz = 'S';

    // contruindo o analizador
    let saida = tinynlp.parse(
        token,
        gramatica,
        raiz
    );
    
    // análise finalizadas
    let estado = saida.getFinishedRoot(raiz);
    
    // verificando s eo input é válido ou não
    let input = document.getElementById('inputGrammar');
    mudaCorTeste(input, estado);
}

function testeRegrasProducao(){
    let states = pegaRegras();
    let resultado = true;
    let inputRegras = document.getElementById('regras_gramatica')
    for (let estado of states){
        resultado = resultado & regex_gramatica_direita.test(estado.split(' ').join(''));
        console.log(resultado)
    }
    mudaCorTeste(inputRegras, resultado);
}

function pegaRegras(){
    /*
     * Pegando o input das regras de produção,
     * trocando as letras maíusculas por "*espaço* Letra", exemplo "A" para " A".    
     */
    let rawStates = document.getElementById('regras_gramatica').value.trim();
    rawStates = rawStates.split(' ').join('')
    rawStates = rawStates.replace(/([A-Z])/g, ' $1');
    //imprimindo os inputs
    console.log(rawStates);

    //separando por linhas
    let states = rawStates.split(/\r?\n/);
    console.log(states);

    return states;
}


function mudaCorTeste(inputTest, valorResultado){
    if (valorResultado) {
        inputTest.style.backgroundColor = '#4ef73b';
    }
    else {
        inputTest.style.backgroundColor = '#f52a2a';
    }
}