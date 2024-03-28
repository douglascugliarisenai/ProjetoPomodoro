<h1 align="center"> FuturoDev [Fitness] </h1>

<h2 align="center"> Exercícios da Semana 9</h2>

<h1 align="center">
    <a href="https://floripamaistec.pmf.sc.gov.br/">🔗 Floripa Mais Tec</a>
</h1>
<p align="center">🚀 Assunto: Mini Projeto Pomodoro

# Pomodoro Timer

Um aplicativo de temporizador pomodoro simples com recursos adicionais, como listagem de exercícios e marcação de exercícios concluídos.

## Tecnologias Utilizadas

- HTML
- CSS
- JavaScript

### Pré-requisitos

⚙ Antes de começar, você vai precisar ter instalado em sua máquina a seguinte ferramenta:
- O editor [VSCode](https://code.visualstudio.com/) e o plugin do [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer). 
- Possuir uma conta no API NInja(API Gratuita)

## Funcionalidades 
    * 🚀 Timer: Foi implementado um timer decrescente utilizando o setInterval 
    * 🚀 Configuração do Timer: Foi incluído um botão para que seja possível o usuário escolher qual tempo de pomodoro desaja fazer. Inicialmente este valor não é possível ser alterado pelo usuário. 
    * 🚀 Botão de Iniciar/Pausar: foi implementado um botão que tem dupla funciolidade. Sendo que ele pode iniciar e pausar o timer.
    * 🚀 Botão de reiniciar: foi implementado um botão para que o usuário possa reiniciar todo o processo.
    * 🚀 Sessão exercício: foi implementado um função que ao finalizar o time ou seja, zerar o tempo a aplicação faz uma request na API do Ninjas passando o tipo de exercício que queremos, neste caso solicitamos que traga todos os alongamentos. E realizamos um filtro do que queremos apresentar para o usuário.
    * 🚀 Botão de concluír exercício: foi implementado um botão para que o usuário concluír seu exercício. Ao clicar neste botão um DIV é adicionada para que seja listado todos exercícios finalizados pelo seu nome apenas.
    * 🚀 LocalStorage: foi implementado uma função para que seja salvo no localstorage o objeto concluído do exercício.


## API Utilizada

- API-Ninjas para buscar exercícios de alongamento.


## Instalação

1. Clone o repositório: git clone [Github](https://github.com/douglascugliarisenai/ProjetoPomodoro)
2. Abra o VS Code e clique no Live Server


## Como Usar

1. Selecione o tempo do pomodoro no menu suspenso ou use o tempo padrão de 25 minutos.
2. Clique em "Iniciar" para iniciar o temporizador.
3. Durante o intervalo, os exercícios serão listados.
4. Ao concluir um exercício, clique em "Concluir" ao lado do exercício na lista.


## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir um problema ou enviar uma solicitação de recebimento. Certifique-se de seguir as diretrizes de contribuição.
