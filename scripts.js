const maxPeriodos = 10;
let contadorPeriodos = 1;  // Começamos com um período já adicionado
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

document.getElementById('dateForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (document.getElementById('valorReativacao').value === "") {
        alert("Por favor, insira o valor da mensalidade.");
        return;
    }
    calcularEAtualizarResultados();
});

document.getElementById('dateForm').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Previne o envio do formulário
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

    const diffTime = Math.abs(data2 - data1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return calcularComMaisUm ? diffDays + 1 : diffDays;
}

function atualizarTipoCalculo() {
    const tipoCalculo = document.getElementById('tipoCalculo').value;

    document.getElementById('reativacaoSection').style.display = 'none';
    document.getElementById('upgradeSection').style.display = 'none';
    document.getElementById('alteracaoSection').style.display = 'none';

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
    const resultado = (valorMensalidade / 30) * totalDias;
    document.getElementById('resultadoReativacao').textContent = `Valor proporcional: R$ ${resultado.toFixed(2)}`;
}

function somarReativacao() {
    const valorProporcional = parseFloat(document.getElementById('resultadoReativacao').textContent.replace('Valor proporcional: R$ ', ''));
    const valorSomar = parseFloat(document.getElementById('valorSomarReativacao').value);
    const resultado = valorProporcional + valorSomar;
    document.getElementById('resultadoSomaReativacao').textContent = `Valor total: R$ ${resultado.toFixed(2)}`;
}

function calcularUpgrade() {
    const totalDias = parseInt(document.getElementById('resultado').textContent.replace('Total de dias de utilização: ', '').replace(' dias.', ''));
    const novaMensalidade = parseFloat(document.getElementById('novaMensalidade').value);
    const antigaMensalidade = parseFloat(document.getElementById('antigaMensalidade').value);
    const resultado = ((novaMensalidade - antigaMensalidade) / 30) * totalDias;
    document.getElementById('resultadoUpgrade').textContent = `Valor proporcional: R$ ${resultado.toFixed(2)}`;
}

function somarUpgrade() {
    const valorProporcional = parseFloat(document.getElementById('resultadoUpgrade').textContent.replace('Valor proporcional: R$ ', ''));
    const valorSomar = parseFloat(document.getElementById('valorSomarUpgrade').value);
    const resultado = valorProporcional + valorSomar;
    document.getElementById('resultadoSomaUpgrade').textContent = `Valor total: R$ ${resultado.toFixed(2)}`;
}

function calcularAlteracao() {
    const totalDias = parseInt(document.getElementById('resultado').textContent.replace('Total de dias de utilização: ', '').replace(' dias.', ''));
    const valorMensalidade = parseFloat(document.getElementById('valorAlteracao').value);
    const resultado = (valorMensalidade / 30) * totalDias;
    document.getElementById('resultadoAlteracao').textContent = `Valor proporcional: R$ ${resultado.toFixed(2)}`;
}

function somarAlteracao() {
    const valorProporcional = parseFloat(document.getElementById('resultadoAlteracao').textContent.replace('Valor proporcional: R$ ', ''));
    const valorSomar = parseFloat(document.getElementById('valorSomarAlteracao').value);
    const resultado = valorProporcional + valorSomar;
    document.getElementById('resultadoSomaAlteracao').textContent = `Valor total: R$ ${resultado.toFixed(2)}`;
}

atualizarTipoCalculo();  // Inicializa com a lógica padrão
