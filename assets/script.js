let minutos = 0;
let segundos = 60;
let idIntervalo;
let tempoPomodoroPadrao = 1;
let tempoDescansoPadrao = 5;
let botaoClicado = false;
let tempoSelecionado;
let exerciciosSelecionados = [];  //Aqui ficam os exercicios selecionados
let exerciciosConcluidos = [];
let exerciciosFiltrados;  // Aqui ficam todos os exercicios
let valorAleatorio;
let offset = 0;
let count = 0;
const digitalContador = document.getElementById('contador');
const labelMinuto = document.getElementById('minutos');
const labelSegundo = document.getElementById('segundos');
const comboTempoPomodoro = document.getElementById('cbTempo');
const btnIniciarPausa = document.getElementById('iniciar');
const imgBtnIniciarPausa = document.getElementById('imagemBotaoIniciar');
const spanNomeExercicio = document.querySelector('.nomeExercicio');
const spanInstrucaoExercicio = document.querySelector('.instrucao');
const btnConcluir = document.querySelector('.concluir');
const main = document.querySelector('.main');
const divAlongamentos = document.querySelector('.alongamentos');
const divListaConcluido = document.querySelector('.listaExercicioConcluidos');
const listaConcluido = document.querySelector('.lista');
const subtituloExercicicio = document.querySelector('.subtitulo');
const subtituloConcluidos = document.querySelector('.subtituloConcluidos');


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

        console.log(count)
        if (count === 0 || count > 9) {
            consultarExercicios()
        }else {
            selecionarExercicioRandomico(exerciciosFiltrados)
        }

        clearInterval(idIntervalo)
        botaoClicado = false
    }
}

function consultarExercicios() {
    const url = 'https://api.api-ninjas.com/v1/exercises'
    const apiKey = 'Lnag8JbVMoTkvuKrLjejsw==V89esMtCr0Z2qNPb';

    offset = count === 10 ? offset += 10 : offset

    const queryParams = {
        type: 'stretching',
        offset: offset
    }

    const queryString = new URLSearchParams(queryParams).toString()

    const UrlCompleta = `${url}?${queryString}`

    let options = {
        method: 'GET',
        headers: { 'X-Api-key': apiKey }
    }

    console.log('Consumindo API:', UrlCompleta)
    fetch(UrlCompleta, options)
        .then(res => res.json())
        .then(data => {

            exerciciosFiltrados = filtrarDados(data)
            selecionarExercicioRandomico(exerciciosFiltrados)
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
}

function pararPomodoro() {
    clearInterval(idIntervalo)
}

function zerarPomodoro() {
    reiniciarPomodoro()
    desabilitarComponentes()

    exerciciosSelecionados.splice(0, exerciciosSelecionados.length)
    exerciciosConcluidos.splice(0, exerciciosConcluidos.length)
    exerciciosFiltrados = ''
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

function filtrarDados(dados) {
    return dados.reduce((acc, cur) => {
        acc.push({ nomeExercicio: cur.name, instrucaoExercicio: cur.instructions });
        return acc;
    }, []);
}

function selecionarExercicioRandomico(lista) {
    let localizouNovo = false

    valorAleatorio = randomizarExercicio(lista)

    while (!localizouNovo) {
        if (exerciciosConcluidos.length != 0) {
            let exercicioValidado = validarExeciciosRepetidos(exerciciosSelecionados, valorAleatorio.nomeExercicio)
            
            if (exercicioValidado) {
                localizouNovo = true
                exerciciosSelecionados.push({ nomeExercicio: valorAleatorio.nomeExercicio, instrucaoExercicio: valorAleatorio.instrucaoExercicio })
            } else {
                valorAleatorio = randomizarExercicio(lista)
                localizouNovo = false
            }
        } else {
            localizouNovo = true
            exerciciosSelecionados.push({ nomeExercicio: valorAleatorio.nomeExercicio, instrucaoExercicio: valorAleatorio.instrucaoExercicio })
        }

        renderizarSessaoExercicio(valorAleatorio)
        count++

        if (btnConcluir.style.display === 'flex') {
            btnConcluir.style.display = 'block';
        } else {
            btnConcluir.style.display = 'flex';
        }
    }
}

function validarExeciciosRepetidos(lista, exercicioRandorizado) {
    let validar = false
    
    lista.forEach(exercicioAtual => {
        if(exercicioAtual.nomeExercicio !== exercicioRandorizado){
            validar = true
        }else{
            validar = false
        }
    });

    return validar
}

function randomizarExercicio(exercicios) {
    let objetoAleatorio = exercicios[Math.floor(Math.random() * exercicios.length)];
    return objetoAleatorio
}

function concluirExercicio() {
    exerciciosConcluidos.push(valorAleatorio)
    renderizarSessaoConcluido(valorAleatorio.nomeExercicio)
    salvarListaConcluidaStorage()

    spanNomeExercicio.innerText = ''
    spanInstrucaoExercicio.innerText = ''
    subtituloExercicicio.innerText = ''

    divAlongamentos.style.backgroundColor = ''
    divAlongamentos.style.borderRadius = ''
    divAlongamentos.style.boxShadow = ''

    btnConcluir.style.display = 'none'
}

function salvarListaConcluidaStorage() {
    let listaObjetosSalvo = localStorage.getItem('minhaListaObjetos');
    
    if(listaObjetosSalvo != null){
        listaObjetosJSON = JSON.parse(listaObjetosSalvo);
    }

    listaObjetosJSON = JSON.stringify(exerciciosConcluidos);
    localStorage.setItem('minhaListaObjetos', listaObjetosJSON);
}

function recuperarExerciciosLocalStorage(){
    let listaObjetosSalvo = localStorage.getItem('minhaListaObjetos');
    let listaObjetos = JSON.parse(listaObjetosSalvo);
    
    if(listaObjetos != null){
        listaObjetos.forEach(exercicioSalvo => {
            renderizarSessaoConcluido(exercicioSalvo.nomeExercicio)
        })
    }
    
}

function desabilitarComponentes() {
    spanNomeExercicio.innerText = ''
    spanInstrucaoExercicio.innerText = ''
    subtituloExercicicio.innerText = ''

    divAlongamentos.style.backgroundColor = ''
    divAlongamentos.style.borderRadius = ''
    divAlongamentos.style.boxShadow = ''

    btnConcluir.style.display = 'none'
}

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
        divListaConcluido.style.boxShadow = '0px 0px 10px 1px rgb(68, 68, 68)'

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

function renderizarSessaoExercicio(exercicioSelecionado) {
    subtituloExercicicio.textContent = 'Exercício'
    subtituloExercicicio.style.fontStyle = 'italic'
    subtituloExercicicio.width = '500px'
    subtituloExercicicio.style.display = 'flex'
    subtituloExercicicio.style.justifyContent = 'center'

    divAlongamentos.insertBefore(subtituloExercicicio, spanNomeExercicio)
    divAlongamentos.style.backgroundColor = 'rgb(82, 156, 86)'
    divAlongamentos.style.borderRadius = '15px'
    divAlongamentos.style.width = '500px'
    divAlongamentos.style.boxShadow = '0px 0px 10px 1px rgb(68, 68, 68)'

    spanNomeExercicio.innerText = exercicioSelecionado.nomeExercicio
    spanInstrucaoExercicio.innerText = exercicioSelecionado.instrucaoExercicio
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