let mode = 'move';
const [canvasDesing, ctx] = createCanvas(innerWidth, innerHeight);
document.body.appendChild(canvasDesing);

let contextMenuPos = { x: 0, y: 0 };
let activeState = null;
const config = {
    state: {
        radius: 20,
        terminalRadius: 5,
    },
};

let fa = new FiniteAutomata();
fa.import('{}');
render();

$('#test').onclick = function () {
    try {
        const nfa2reConverter = new convert2RE(fa);
        const resFA = nfa2reConverter.run();
        let { transitions } = resFA.states[resFA.start];
        let symbol;
        
        for (symbol in transitions) {
            if (!transitions.hasOwnProperty(symbol)) continue;
            if (transitions[symbol].length) break;
        }

        const machineReadableRegexConverter = new MachineReadableRegexConverter();
        symbol =     machineReadableRegexConverter.convert(symbol);
        const regex = new RegExp(`^${symbol}$`);

        const string = prompt('Insira a string a ser testada:');
        if (string && string.trim()) {
            alert(regex.test(string.trim()) ? 'Sucesso' : 'Erro');
        }
    } catch (e) {
        handleError(e);
    }
};

// celso se vc olhar aqui da um pulinho ;)
$('#regex').onclick = function () {
    const nfa2reConverter = new convert2RE(fa);
    const resFA = nfa2reConverter.run();
    let { transitions } = resFA.states[resFA.start];
    let symbol;
    
    for (symbol in transitions) {
        if (!transitions.hasOwnProperty(symbol)) continue;
        if (transitions[symbol].length) break;
    }

    const machineReadableRegexConverter = new MachineReadableRegexConverter();
    console.log(symbol)
    symbol =     machineReadableRegexConverter.convert(symbol);
    alert(symbol);
}

$('#reset').onclick = function () {
    if (!confirm('Tem certeza? Tudo será apagado!')) return;

    fa = new FiniteAutomata();

    try {
        localStorage.removeItem('fa');
        localStorage.removeItem('mode');
    } catch (e) {
        handleError(e);
    }

    render();
};

$$('#mode > button').forEach(
    button =>
        (button.onclick = function () {
            $$('#mode > button').forEach(button => button.classList.remove('active'));
            mode = this.getAttribute('data-key');
            this.classList.add('active');
        })
);

window.onkeydown = function (e) {
    if (mode !== 'move' && e.ctrlKey) {
        $('#mode [data-key="design"]').click();
    }
};
window.onkeyup = function (e) {
    if (mode !== 'design' && e.key === 'Control') {
        $('#mode [data-key="move"]').click();
    }
};
window.onresize = function () {
    canvasDesing.width = window.innerWidth;
    canvasDesing.height = window.innerHeight;

    render();
};
window.onkeypress = function (e) {
    switch (e.key) {
        case 'm':
            $('#mode [data-key="move"]').click();
            break;

        case 'd':
            $('#mode [data-key="design"]').click();
            break;
    }
};

canvasDesing.onmousedown = function ({ button, x, y }) {
    contextMenu();

    if (mode === 'move' && button !== 2) {
        const states = fa.findNearestStates(x, y);
        if (states.length) {
            activeState = states[0].name;
        }
    }

    if (mode === 'design' && button !== 2) {
        const states = fa.findNearestStates(x, y);
        if (states.length) {
            activeState = states[0].name;
        }
    }
};

canvasDesing.onmouseup = function ({ x, y }) {
    if (mode === 'move' && activeState !== null) {
        const state = fa.states[activeState];
        state.moving = false;

        activeState = null;

        render();
    }

    if (mode === 'design' && activeState !== null) {
        const states = fa.findNearestStates(x, y);
        if (states.length) {
            const start = fa.states[activeState];
            const target = states[0];
            const symbol = prompt('Insira um símbolo ("." para lambda):');

            if (symbol !== null) start.translate(symbol, target.name);
        }
        render();
        activeState = null;
    }
};

canvasDesing.onmousemove = function ({ x, y }) {
    if (mode === 'move' && activeState !== null) {
        const movingState = fa.states[activeState];

        movingState.x = x;
        movingState.y = y;

        render();
    }

    if (mode === 'design' && activeState !== null) {
        const beginState = fa.states[activeState];
        ctx.clearRect(0, 0, canvasDesing.width, canvasDesing.height);

        ctx.beginPath();

        ctx.moveTo(beginState.x, beginState.y);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.closePath();
        ctx.restore();

        render(false);
    }
};
function onTransitionRemoveClick(data) {
    contextMenu();
    const states = fa.findNearestStates(contextMenuPos.x, contextMenuPos.y);
    if (!states.length) return false;

    const state = states[0];
    const [symbol, target] = data.split('-');

    if (symbol in state.transitions && state.transitions[symbol].includes(target)) {
        state.transitions[symbol] = state.transitions[symbol].filter(s => s !== target);
        if (state.transitions[symbol].length === 0) {
            delete state.transitions[symbol];
        }
    }

    // save();
    render();
}

function onTransitionRenameClick(data) {
    contextMenu();
    const states = fa.findNearestStates(contextMenuPos.x, contextMenuPos.y);

    // no state selected, so terminate the rest of execution
    if (!states.length) return false;

    const state = states[0];
    const [symbol, target] = data.split('-');
    const newSymbol = prompt('Insira um símbolo ("." para vazio):', symbol);
    // if operation canceled or newSymbol is equals to old symbol, terminate the rest of execution
    if (newSymbol === null || newSymbol === symbol) return false;

    if (state.transitions[symbol].length > 1) {
        state.transitions[symbol] = state.transitions[symbol].filter(s => s !== target);
        if (!state.transitions[newSymbol] || state.transitions[newSymbol].length === 0) {
            state.transitions[newSymbol] = [];
        }
        state.transitions[newSymbol].push(target);
    } else {
        delete state.transitions[symbol];
        if (state.transitions[newSymbol]) {
            state.transitions[newSymbol].push(target);
            state.transitions[newSymbol] = [...new Set(state.transitions[newSymbol])];
        } else {
            state.transitions[newSymbol] = [target];
        }
    }

    render();
}

canvasDesing.oncontextmenu = function (e) {
    e.preventDefault();
    const { x, y } = e;
    contextMenuPos = { x, y };
    const states = fa.findNearestStates(x, y);

    if (states.length) {
        const state = states[0];
        const items = [
            {
                text: 'terminal? ',
                onclick: () => {
                    const states = fa.findNearestStates(contextMenuPos.x, contextMenuPos.y);

                    if (states.length) {
                        const state = states[0];
                        state.terminal = !state.terminal;

                        render();
                    }

                    contextMenu();
                },
            },
            {
                text: 'Renomear estado',
                onclick: () => {
                    contextMenu();
                    const states = fa.findNearestStates(contextMenuPos.x, contextMenuPos.y);
                    if (!states.length) return false;

                    const state = states[0];
                    const oldName = state.name;
                    const newName = prompt('Insira o novo nome:', oldName);
                    if (newName === null || !newName.trim() || newName === oldName) return;

                    if (fa.states[newName] !== undefined) {
                        return alert('Estado ' + newName + ' já existe.');
                    }

                    fa.states[newName] = fa.states[oldName];
                    fa.states[newName].name = newName;
                    delete fa.states[oldName];

                    // rename transitions target of the other states
                    for (let key in fa.states) {
                        if (!fa.states.hasOwnProperty(key)) continue;

                        const state = fa.states[key];

                        if (state.name === oldName) {
                            state.name = newName;
                        }
                        for (let symbol in state.transitions) {
                            if (!state.transitions.hasOwnProperty(symbol)) continue;

                            for (let s in state.transitions[symbol]) {
                                if (!state.transitions[symbol].hasOwnProperty(s)) continue;

                                if (state.transitions[symbol][s] === oldName) {
                                    state.transitions[symbol][s] = newName;
                                }
                            }
                        }
                    }

                    // if oldName was start, make newName as start point
                    if (fa.start === oldName) {
                        fa.start = newName;
                    }

                    render();
                },
            },
            {
                text: 'Remover estado',
                onclick: () => {
                    const states = fa.findNearestStates(contextMenuPos.x, contextMenuPos.y);

                    if (states.length) {
                        const state = states[0];
                        try {
                            fa.removeState(state.name);
                            render();
                        } catch (e) {
                            console.log(e);
                        }
                    }

                    contextMenu();
                },
            },
        ];

        const removeTransitionsMenu = [];
        for (let symbol in state.transitions) {
            if (!state.transitions.hasOwnProperty(symbol)) continue;

            for (let target of state.transitions[symbol]) {
                removeTransitionsMenu.push({
                    text: `σ({${state.name}}, ${symbol === '' ? 'λ' : symbol}) = {${target}}`,
                    data: `${symbol}-${target}`,
                    onclick: onTransitionRemoveClick,
                });
            }
        }
        if (removeTransitionsMenu.length) {
            items.push({
                text: 'Remover transições',
                children: removeTransitionsMenu,
            });
        }

        const renameTransitionsMenu = [];
        for (let symbol in state.transitions) {
            if (!state.transitions.hasOwnProperty(symbol)) continue;

            for (let target of state.transitions[symbol]) {
                renameTransitionsMenu.push({
                    text: `σ({${state.name}}, ${symbol === '' ? 'λ' : symbol}) = {${target}}`,
                    data: `${symbol}-${target}`,
                    onclick: onTransitionRenameClick,
                });
            }
        }

        if (fa.start !== state.name) {
            items.push({
                text: 'Ponto de início',
                onclick: () => {
                    const states = fa.findNearestStates(contextMenuPos.x, contextMenuPos.y);

                    if (states.length) {
                        const state = states[0];
                        fa.start = state.name;

                        render();
                    }

                    contextMenu();
                },
            });
        }

        contextMenu({ x, y, items });
    } else {
        contextMenu({
            x,
            y,
            items: [
                {
                    text: 'Criar novo estado',
                    onclick: () => {
                        const { x, y } = contextMenuPos;
                        const name = prompt('Insira o nome do estado?');

                        if (name === null || !name.trim()){
                            contextMenu();
                            return;
                        } 

                        try {
                            fa.addState({
                                name,
                                x,
                                y,
                            });
                        } catch (e) {
                            console.log(e);
                        }

                        contextMenu();
                        render();
                    },
                },
            ],
        });
    }
};