const maxPeriodos = 10; 
let contadorPeriodos = 1;  
let calcularComMaisUm = true;

function adicionarPeriodo() {
    if (contadorPeriodos >= maxPeriodos) {
        alert('Você já adicionou o número máximo de períodos.');
        return;
    }

    const container = document.getElementById('datePairsContainer');

    const periodoDiv = document.createElement('div');
    periodoDiv.classList.add('date-pair');
    periodoDiv.innerHTML = `
        <label for="dataInicial${contadorPeriodos}">Data Inicial: </label>
        <input type="date" id="dataInicial${contadorPeriodos}" required>
        <label for="dataFinal${contadorPeriodos}">Data Final: </label>
        <input type="date" id="dataFinal${contadorPeriodos}" required>
        <button type="button" class="remove-button" onclick="removerPeriodo(${contadorPeriodos})">Excluir Período</button>
    `;
    container.appendChild(periodoDiv);

    contadorPeriodos++;
}

function removerPeriodo(id) {
    const periodoDiv = document.getElementById(`dataInicial${id}`).parentElement;
    periodoDiv.remove();
    contadorPeriodos--;
}

// Função de cálculo sem verificar o valor da mensalidade
document.getElementById('dateForm').addEventListener('submit', function(event) {
    event.preventDefault();
    calcularEAtualizarResultados();
});

// Tecla Enter também dispara o cálculo
document.getElementById('dateForm').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        calcularEAtualizarResultados();
    }
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
    return totalDias;
}

function calcularDiasEntreDatas(dataInicial, dataFinal) {
    const data1 = new Date(dataInicial);
    const data2 = new Date(dataFinal);
    
    // Ajustar para que cada mês tenha 30 dias
    const dias1 = (data1.getUTCFullYear() * 360) + ((data1.getUTCMonth() + 1 - 1) * 30) + data1.getUTCDate();
    const dias2 = (data2.getUTCFullYear() * 360) + ((data2.getUTCMonth() + 1 - 1) * 30) + data2.getUTCDate();

    return calcularComMaisUm ? (dias2 - dias1) + 1 : (dias2 - dias1);
}

function atualizarTipoCalculo() {
    const tipoCalculo = document.getElementById('tipoCalculo').value;

    // Ocultar todas as seções
    document.getElementById('reativacaoSection').style.display = 'none';
    document.getElementById('upgradeSection').style.display = 'none';
    document.getElementById('alteracaoSection').style.display = 'none';

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



atualizarTipoCalculo();
