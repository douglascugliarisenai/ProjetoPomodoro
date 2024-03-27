let minutos = 0
let segundos = 60
let idIntervalo;
let tempoPomodoroPadrao = 25
let tempoDescansoPadrao = 5
let digitalContador = document.getElementById('contador')
let labelMinuto = document.getElementById('minutos')
let labelSegundo = document.getElementById('segundos')
const comboTempoPomodoro = document.getElementById('cbTempo')
const btnIniciarPausa = document.getElementById('iniciar')
const imgBtnIniciarPausa = document.getElementById('imagemBotaoIniciar')
const spanNomeExercicio = document.querySelector('.nomeExercicio')
const spanInstrucaoExercicio = document.querySelector('.instrucao')
const btnConcluir = document.querySelector('.concluir')
const main = document.querySelector('.main')
const divAlongamentos = document.querySelector('.alongamentos')
const divListaConcluido = document.querySelector('.listaExercicioConcluidos')
const listaConcluido = document.querySelector('.lista')
const subtituloExercicicio = document.querySelector('.subtitulo')
const subtituloConcluidos = document.querySelector('.subtituloConcluidos')
let tempoSelecionado
let exerciciosSelecionados = []
let exerciciosConcluidos = []
let botaoClicado = false;
let exerciciosFiltrados
let valorAleatorio


function iniciarPausarPomodoro() {
    botaoClicado = !botaoClicado;

    if (botaoClicado) {
        if (minutos == 0 & segundos == 0) {
            reiniciarPomodoro()
        }
        imgBtnIniciarPausa.src = "../assets/img/pause.png";
        iniciarPomodoro()

    } else {
        imgBtnIniciarPausa.src = "../assets/img/play.png";
        pararPomodoro()

    }
}


function iniciarPomodoro() {
    if (tempoSelecionado === undefined) {
        minutos = tempoPomodoroPadrao
    } else {
        minutos = parseInt(tempoSelecionado)
    }

    minutos--
    idIntervalo = setInterval(contadorTempo, 1000)
}

function pararPomodoro() {
    clearInterval(idIntervalo)
}

function zerarPomodoro() {
    reiniciarPomodoro()

    exerciciosSelecionados.splice(0, exerciciosSelecionados.length)
    exerciciosConcluidos.splice(0, exerciciosConcluidos.length)
    exerciciosFiltrados = ''
}

function contadorTempo() {
    if (segundos === 0) {
        minutos--
        segundos = 59
    } else {
        segundos--
    }

    labelMinuto.innerText = formatarContador(minutos)
    labelSegundo.innerText = formatarContador(segundos)


    if (minutos == 0 & segundos == 0) {
        imgBtnIniciarPausa.src = "../assets/img/play.png";

        pegarExercicios()
        clearInterval(idIntervalo)
        botaoClicado = false
    }
}

function reiniciarPomodoro() {
    clearInterval(idIntervalo)
    labelMinuto.innerText = tempoSelecionado != undefined ? tempoSelecionado : tempoPomodoroPadrao
    labelSegundo.innerText = formatarContador('0')
    minutos = 0
    segundos = 60
}

function configurarTempo() {
    const divElementosConfigurar = document.querySelector('.config');

    if (divElementosConfigurar.style.display === 'none') {
        divElementosConfigurar.style.display = 'block';
    } else {
        divElementosConfigurar.style.display = 'none';
    }
}

function selecionarTempoPomodoro() {
    tempoSelecionado = comboTempoPomodoro.value
    labelMinuto.innerText = tempoSelecionado
    labelSegundo.innerText = '00'
}

function formatarContador(numero) {
    return numero < 10 ? `0${numero}` : numero;
}

function pegarExercicios() {
    const url = 'https://api.api-ninjas.com/v1/exercises'
    const apiKey = 'Lnag8JbVMoTkvuKrLjejsw==V89esMtCr0Z2qNPb';

    const queryParams = {
        type: 'stretching',
        offset: 100
    }

    const queryString = new URLSearchParams(queryParams).toString()

    const UrlCompleta = `${url}?${queryString}`

    let options = {
        method: 'GET',
        headers: { 'X-Api-key': apiKey }
    }

    fetch(UrlCompleta, options)
        .then(res => res.json())
        .then(data => {

            exerciciosFiltrados = data.reduce((acc, cur) => {
                acc.push({ nomeExercicio: cur.name, instrucaoExercicio: cur.instructions });
                return acc;
            }, []);

            selecionarExercicioRandomico(exerciciosFiltrados)
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
}

function selecionarExercicioRandomico(lista) {
    let localizouNovo = false

    valorAleatorio = randomizarExercicio(lista)

    while (!localizouNovo) {
        if (exerciciosConcluidos.length != 0) {
            let exercicioValidado = validarExeciciosRepetidos(exerciciosConcluidos, valorAleatorio.nomeExercicio)
            if (exercicioValidado) {
                localizouNovo = true
                exerciciosSelecionados.push({ nomeExercicio: valorAleatorio.nomeExercicio, instrucaoExercicio: valorAleatorio.instrucaoExercicio })
            } else {
                console.log('Entrou no ELSE')
                valorAleatorio = randomizarExercicio(lista)
                localizouNovo = false
            }
        } else {
            localizouNovo = true
            exerciciosSelecionados.push({ nomeExercicio: valorAleatorio.nomeExercicio, instrucaoExercicio: valorAleatorio.instrucaoExercicio })
        }

        renderizarSessaoExercicio()

        if (btnConcluir.style.display === 'flex') {
            btnConcluir.style.display = 'block';
        } else {
            btnConcluir.style.display = 'flex';
        }
    }
}

function validarExeciciosRepetidos(lista, exercicioRandorizado) {
    console.log(lista)
    console.log(lista.nomeExercicio)
    if(lista.nomeExercicio != exercicioRandorizado){
            return true
    }

    return false;
}


function randomizarExercicio(exercicios) {
    let objetoAleatorio = exercicios[Math.floor(Math.random() * exercicios.length)];
    return objetoAleatorio
}

function concluirExercicio() {
    exerciciosSelecionados.forEach((exercicio) => {
        exerciciosConcluidos.push({ exercicio })
        renderizarSessaoConcluido(exercicio.nomeExercicio)
    });

    spanNomeExercicio.innerText = ''
    spanInstrucaoExercicio.innerText = ''
    subtituloExercicicio.innerText = ''

    divAlongamentos.style.backgroundColor = ''
    divAlongamentos.style.borderRadius = ''

    btnConcluir.style.display = 'none'
}


// function tranduzir(texto) {
//     let options = {
//         method: 'POST',
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//             "Accept":"application/json",
//             "Authorization": "Basic NDQ2Ni0yUUZMR1dHYzpUekpOQmVqVTBuMXkwR2p4Vnhld05lUUpmb2pKb2NxZitZTnM5aDRF"
//         },
//         body: {
//             text: texto,
//             target_lang: "EN",
//             source_lang: "PtBr"
//         },
//     }

//     fetch("https://api-free.deepl.com", options)
//         .then(res => res.json()) // parse response as JSON
//         .then(data => {
//             console.log(data.json());
//         })

// }

function renderizarSessaoConcluido(exercicio) {
    if (!verificaDescricao(exercicio)) {
        const listItem = document.createElement('li')
        listItem.textContent = exercicio
        listItem.style.textDecoration = 'line-through'
        listItem.style.listStyle = 'none'

        divListaConcluido.style.backgroundColor = 'rgb(82, 156, 86)'
        divListaConcluido.style.borderRadius = '15px'
        divListaConcluido.style.padding = '15px'
        divListaConcluido.style.width = '500px'

        subtituloConcluidos.style.display = 'flex'
        subtituloConcluidos.style.justifyContent = 'center'

        listaConcluido.style.padding = '15px'
        listaConcluido.style.width = '500px'
        listaConcluido.style.display = 'flex'
        listaConcluido.style.justifyContent = 'center'

        divListaConcluido.appendChild(listaConcluido)
        listaConcluido.appendChild(listItem)
    }
}

function renderizarSessaoExercicio() {
    subtituloExercicicio.textContent = 'Exercício'
    subtituloExercicicio.style.fontStyle = 'italic'
    subtituloExercicicio.width = '500px'
    subtituloExercicicio.style.display = 'flex'
    subtituloExercicicio.style.justifyContent = 'center'

    divAlongamentos.insertBefore(subtituloExercicicio, spanNomeExercicio)
    divAlongamentos.style.backgroundColor = 'rgb(82, 156, 86)'
    divAlongamentos.style.borderRadius = '15px'
    divAlongamentos.style.width = '500px'

    spanNomeExercicio.innerText = valorAleatorio.nomeExercicio
    spanInstrucaoExercicio.innerText = valorAleatorio.instrucaoExercicio
}

function verificaDescricao(descricao) {
    let lista = document.getElementsByTagName('li');
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].textContent === descricao) {
            return true;
        }
    }
    return false;
}