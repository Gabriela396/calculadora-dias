const maxPeriodos = 10; 
let contadorPeriodos = 1;  
let calcularComMaisUm = true;

function adicionarPeriodo() {
    if (contadorPeriodos >= maxPeriodos) {
        alert('Você já adicionou o número máximo de períodos.');
        return;
    }

    const container = document.getElementById('datePairsContainer');

    // Criar a div do período com a mesma estrutura do fixo
    const periodoDiv = document.createElement('div');
    periodoDiv.classList.add('date-pair'); // Mantém a classe igual ao fixo

    periodoDiv.innerHTML = `
        <label for="dataInicial${contadorPeriodos}">Data Inicial:</label>
        <input type="date" id="dataInicial${contadorPeriodos}" required>
        <label for="dataFinal${contadorPeriodos}">Data Final:</label>
        <input type="date" id="dataFinal${contadorPeriodos}" required>
        <button type="button" class="remove-button" onclick="removerPeriodo(${contadorPeriodos})">Excluir Período</button>
    `;

    container.appendChild(periodoDiv);

    // Adiciona eventos de cálculo automático ao novo período
    const inputInicial = document.getElementById(`dataInicial${contadorPeriodos}`);
    const inputFinal = document.getElementById(`dataFinal${contadorPeriodos}`);

    inputInicial.addEventListener("input", calcularTotalDias);
    inputFinal.addEventListener("input", calcularTotalDias);

    contadorPeriodos++;
}

function calcularTotalDias() {
    let totalDias = 0;

    for (let i = 1; i < contadorPeriodos; i++) {  // Começa de 1 pois o primeiro período já está contado
        const dataInicial = document.getElementById(`dataInicial${i}`);
        const dataFinal = document.getElementById(`dataFinal${i}`);

        if (dataInicial && dataFinal && dataInicial.value && dataFinal.value) {
            const diasEntreDatas = calcularDiasEntreDatas(dataInicial.value, dataFinal.value);
            totalDias += diasEntreDatas;
        }
    }

    // Atualiza o resultado automaticamente na página
    document.getElementById('resultado').textContent = `Total de dias de utilização: ${totalDias} dias.`;

    return totalDias;
}

function calcularDiasEntreDatas(dataInicial, dataFinal) {
    const data1 = new Date(dataInicial);
    const data2 = new Date(dataFinal);

    // Subtrai as datas e converte de milissegundos para dias
    const diferença = (data2 - data1) / (1000 * 3600 * 24);
    return calcularComMaisUm ? diferença + 1 : diferença;
}

function removerPeriodo(id) {
    const periodoDiv = document.getElementById(`dataInicial${id}`).parentElement;
    periodoDiv.remove();
    contadorPeriodos--;
}


document.getElementById('dateForm').addEventListener('submit', function(event) {
    event.preventDefault();
    calcularEAtualizarResultados();
});


function calcularEAtualizarResultados() {
    let totalDias = calcularTotalDias();
    document.getElementById('resultado').textContent = `Total de dias de utilização: ${totalDias} dias.`;
    atualizarValoresCalculo(totalDias);
}

function calcularTotalDias() {
    let totalDias = 0;
    for (let i = 0; i < contadorPeriodos; i++) {
        const dataInicial = document.getElementById(`dataInicial${i}`).value;
        const dataFinal = document.getElementById(`dataFinal${i}`).value;

        if (dataInicial && dataFinal) {
            const diasEntreDatas = calcularDiasEntreDatas(dataInicial, dataFinal);
            totalDias += diasEntreDatas;
        }
    }

    // Atualiza o resultado automaticamente na página
    document.getElementById('resultado').textContent = `Total de dias de utilização: ${totalDias} dias.`;

    return totalDias;
}

function calcularDiasEntreDatas(dataInicial, dataFinal) {
    const data1 = new Date(dataInicial);
    const data2 = new Date(dataFinal);
    
    const dias1 = (data1.getUTCFullYear() * 360) + ((data1.getUTCMonth() + 1 - 1) * 30) + data1.getUTCDate();
    const dias2 = (data2.getUTCFullYear() * 360) + ((data2.getUTCMonth() + 1 - 1) * 30) + data2.getUTCDate();

    return calcularComMaisUm ? (dias2 - dias1) + 1 : (dias2 - dias1);
}

document.addEventListener("DOMContentLoaded", function() {
    // Seleciona os inputs do primeiro período fixo
    const inputInicialFixo = document.getElementById("dataInicial0");
    const inputFinalFixo = document.getElementById("dataFinal0");

    // Adiciona eventos para validar as datas no primeiro período fixo
    inputInicialFixo.addEventListener("input", () => validarPeriodo(inputInicialFixo, inputFinalFixo));
    inputFinalFixo.addEventListener("input", () => validarPeriodo(inputInicialFixo, inputFinalFixo));

    // Adiciona eventos para calcular automaticamente os dias ao alterar as datas
    inputInicialFixo.addEventListener("input", calcularTotalDias);
    inputFinalFixo.addEventListener("input", calcularTotalDias);

    // Adiciona eventos aos demais períodos já existentes (caso existam)
    for (let i = 1; i < contadorPeriodos; i++) {
        const inputInicial = document.getElementById(`dataInicial${i}`);
        const inputFinal = document.getElementById(`dataFinal${i}`);

        if (inputInicial && inputFinal) {
            inputInicial.addEventListener("input", () => validarPeriodo(inputInicial, inputFinal));
            inputFinal.addEventListener("input", () => validarPeriodo(inputInicial, inputFinal));
            inputInicial.addEventListener("input", calcularTotalDias);
            inputFinal.addEventListener("input", calcularTotalDias);
        }
    }
});


function atualizarTipoCalculo() {
    const tipoCalculo = document.getElementById('tipoCalculo').value;

    // Ocultar todas as seções
    document.getElementById('reativacaoSection').style.display = 'none';
    document.getElementById('upgradeSection').style.display = 'none';
    document.getElementById('alteracaoSection').style.display = 'none';
    document.getElementById('descontoSection').style.display = 'none';

    // Mostrar a seção correspondente ao tipo de cálculo
    if (tipoCalculo === 'reativacao') {
        calcularComMaisUm = true;
        document.getElementById('reativacaoSection').style.display = 'block';
    } else if (tipoCalculo === 'upgrade') {
        calcularComMaisUm = false;
        document.getElementById('upgradeSection').style.display = 'block';
    } else if (tipoCalculo === 'alteracao') {
        calcularComMaisUm = false;
        document.getElementById('alteracaoSection').style.display = 'block';
    } else if (tipoCalculo === 'desconto') {
        calcularComMaisUm = true;
        document.getElementById('descontoSection').style.display = 'block';
    }

    // Recalcular os resultados
    calcularEAtualizarResultados();
}


function atualizarValoresCalculo(totalDias) {
    const tipoCalculo = document.getElementById('tipoCalculo').value;

    if (tipoCalculo === 'reativacao') {
        calcularReativacao(totalDias);
    } else if (tipoCalculo === 'upgrade') {
        calcularUpgrade(totalDias);
    } else if (tipoCalculo === 'alteracao') {
        calcularAlteracao(totalDias);
    }
}

function calcularReativacao() {
    const totalDias = parseInt(document.getElementById('resultado').textContent.replace('Total de dias de utilização: ', '').replace(' dias.', ''));
    const valorMensalidade = parseFloat(document.getElementById('valorReativacao').value);
    
    if (!isNaN(valorMensalidade) && totalDias > 0) {
        const resultado = (valorMensalidade / 30) * totalDias;
        document.getElementById('resultadoReativacao').textContent = `Valor proporcional: R$ ${resultado.toFixed(2)}`;
    } 
}

function calcularUpgrade() {
    const totalDias = parseInt(document.getElementById('resultado').textContent.replace('Total de dias de utilização: ', '').replace(' dias.', ''));
    const novaMensalidade = parseFloat(document.getElementById('novaMensalidade').value);
    const antigaMensalidade = parseFloat(document.getElementById('antigaMensalidade').value);
    
    if (!isNaN(novaMensalidade) && !isNaN(antigaMensalidade) && totalDias > 0) {
        const resultado = ((novaMensalidade - antigaMensalidade) / 30) * totalDias;
        document.getElementById('resultadoUpgrade').textContent = `Valor proporcional: R$ ${resultado.toFixed(2)}`;
    } 
}

function calcularAlteracao() {
    const totalDias = parseInt(document.getElementById('resultado').textContent.replace('Total de dias de utilização: ', '').replace(' dias.', ''));
    const valorMensalidade = parseFloat(document.getElementById('valorAlteracao').value);
    
    if (!isNaN(valorMensalidade) && totalDias > 0) {
        const resultado = (valorMensalidade / 30) * totalDias;
        document.getElementById('resultadoAlteracao').textContent = `Valor proporcional: R$ ${resultado.toFixed(2)}`;
    } 
}

function calcularDesconto() {
    const valorMensalidade = parseFloat(document.getElementById('valorDesconto').value);
    const totalDias = parseInt(document.getElementById('resultado').textContent.replace('Total de dias de utilização: ', '').replace(' dias.', ''));

    if (!isNaN(valorMensalidade) && !isNaN(totalDias) && totalDias > 0) {
        // Calcula o desconto proporcional
        const desconto = (valorMensalidade / 30) * totalDias;
        
        // Calcula o valor da mensalidade após o desconto
        const mensalidadeComDesconto = valorMensalidade - desconto;

        // Exibe os valores na tela
        const resultadoDescontoElement = document.getElementById('resultadoDesconto');
        resultadoDescontoElement.innerHTML = `
            Valor do desconto: R$ ${desconto.toFixed(2)} <br>
            O valor total da mensalidade com desconto é: R$ ${mensalidadeComDesconto.toFixed(2)}
        `;

        // Aplica a classe de estilo
        resultadoDescontoElement.classList.add('valorTotalStyle');
    }
}

function somarReativacao() {
    const valorProporcional = parseFloat(document.getElementById('resultadoReativacao').textContent.replace('Valor proporcional: R$ ', ''));
    const valorSomar = parseFloat(document.getElementById('valorSomarReativacao').value);
    if (!isNaN(valorProporcional) && !isNaN(valorSomar)) {
        const resultado = valorProporcional + valorSomar;
        const resultadoSomaElement = document.getElementById('resultadoSomaReativacao');
        resultadoSomaElement.textContent = `Valor total: R$ ${resultado.toFixed(2)}`;
        
        
        resultadoSomaElement.classList.add('valorTotalStyle');
    }
}


function somarUpgrade() {
    const valorProporcional = parseFloat(document.getElementById('resultadoUpgrade').textContent.replace('Valor proporcional: R$ ', ''));
    const valorSomar = parseFloat(document.getElementById('valorSomarUpgrade').value);
    if (!isNaN(valorProporcional) && !isNaN(valorSomar)) {
        const resultado = valorProporcional + valorSomar;
        const resultadoSomaElement = document.getElementById('resultadoSomaUpgrade');
        resultadoSomaElement.textContent = `Valor total: R$ ${resultado.toFixed(2)}`;
        
        
        resultadoSomaElement.classList.add('valorTotalStyle');
    }
}


function somarAlteracao() {
    const valorProporcional = parseFloat(document.getElementById('resultadoAlteracao').textContent.replace('Valor proporcional: R$ ', ''));
    const valorSomar = parseFloat(document.getElementById('valorSomarAlteracao').value);
    if (!isNaN(valorProporcional) && !isNaN(valorSomar)) {
        const resultado = valorProporcional + valorSomar;
        const resultadoSomaElement = document.getElementById('resultadoSomaAlteracao');
        resultadoSomaElement.textContent = `Valor total: R$ ${resultado.toFixed(2)}`;
        
       
        resultadoSomaElement.classList.add('valorTotalStyle');
    }
}


let prevScrollPos = window.pageYOffset;

window.onscroll = function() {
    let currentScrollPos = window.pageYOffset;
    if (prevScrollPos > currentScrollPos) {
        // Rolando para cima
        document.querySelector('.header').style.top = "0";
    } else {
        // Rolando para baixo
        document.querySelector('.header').style.top = "-60px"; // Ajuste conforme necessário
    }
    prevScrollPos = currentScrollPos;
}


document.querySelectorAll(".btn-principal").forEach(botao => {
    botao.addEventListener("click", function(event) {
        for (let i = 0; i < 8; i++) { // Cria X borboletas por clique
            criarBorboleta(event.clientX, event.clientY);
        }
    });
});

function criarBorboleta(x, y) {
    let borboleta = document.createElement("div");
    borboleta.classList.add("borboleta");
    borboleta.style.left = `${x}px`;
    borboleta.style.top = `${y}px`;
    borboleta.style.setProperty("--x", Math.random()); // Define um movimento aleatório
    borboleta.style.setProperty("--y", Math.random());
    
    document.body.appendChild(borboleta);

    setTimeout(() => {
        borboleta.remove();
    }, 2000);
}



atualizarTipoCalculo();