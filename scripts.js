const maxPeriodos = 10;
let contadorPeriodos = 1; // Começamos com um período já adicionado
let calcularComMaisUm = true;

// Função para adicionar um novo período de datas
function adicionarPeriodo() {
    if (contadorPeriodos >= maxPeriodos) {
        alert('Você já adicionou o número máximo de períodos.');
        return;
    }

    const container = document.getElementById('datePairsContainer');

    const periodoDiv = document.createElement('div');
    periodoDiv.classList.add('date-pair');
    periodoDiv.id = `periodo${contadorPeriodos}`;
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

// Função para remover um período de datas
function removerPeriodo(id) {
    const periodoDiv = document.getElementById(`periodo${id}`);
    periodoDiv.remove();
    contadorPeriodos--;
}

// Função para calcular e atualizar o resultado total de dias de utilização
document.getElementById('dateForm').addEventListener('submit', function (event) {
    event.preventDefault();
    calcularEAtualizarResultados();
});

// Função para calcular o total ao pressionar "Enter"
document.getElementById('dateForm').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        calcularEAtualizarResultados();
    }
});

// Função para calcular os dias entre duas datas considerando cada mês com 30 dias
function calcularDiasEntreDatas(dataInicial, dataFinal) {
    const [ano1, mes1, dia1] = dataInicial.split('-').map(Number);
    const [ano2, mes2, dia2] = dataFinal.split('-').map(Number);

    const dias1 = ano1 * 360 + (mes1 - 1) * 30 + dia1;
    const dias2 = ano2 * 360 + (mes2 - 1) * 30 + dia2;

    return calcularComMaisUm ? dias2 - dias1 + 1 : dias2 - dias1;
}

// Função para calcular o total de dias de todos os períodos adicionados
function calcularEAtualizarResultados() {
    let totalDias = 0;
    for (let i = 0; i < contadorPeriodos; i++) {
        const dataInicial = document.getElementById(`dataInicial${i}`)?.value;
        const dataFinal = document.getElementById(`dataFinal${i}`)?.value;
        if (dataInicial && dataFinal) {
            totalDias += calcularDiasEntreDatas(dataInicial, dataFinal);
        }
    }
    document.getElementById('resultado').textContent = `Total de dias de utilização: ${totalDias} dias.`;
}

// Função para atualizar a exibição do tipo de cálculo selecionado
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
    calcularEAtualizarResultados(); // Recalcula automaticamente com base no tipo de cálculo
}

// Funções específicas de cálculo por tipo
function calcularReativacao() {
    const totalDias = parseInt(document.getElementById('resultado').textContent.replace('Total de dias de utilização: ', '').replace(' dias.', ''));
    const valorMensalidade = parseFloat(document.getElementById('valorReativacao').value);
    if (!isNaN(valorMensalidade) && totalDias > 0) {
        const resultado = (valorMensalidade / 30) * totalDias;
        document.getElementById('resultadoReativacao').textContent = `Valor proporcional: R$ ${resultado.toFixed(2)}`;
    }
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
    if (!isNaN(novaMensalidade) && !isNaN(antigaMensalidade) && totalDias > 0) {
        const resultado = ((novaMensalidade - antigaMensalidade) / 30) * totalDias;
        document.getElementById('resultadoUpgrade').textContent = `Valor proporcional: R$ ${resultado.toFixed(2)}`;
    }
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
    if (!isNaN(valorMensalidade) && totalDias > 0) {
        const resultado = (valorMensalidade / 30) * totalDias;
        document.getElementById('resultadoAlteracao').textContent = `Valor proporcional: R$ ${resultado.toFixed(2)}`;
    }
}

function somarAlteracao() {
    const valorProporcional = parseFloat(document.getElementById('resultadoAlteracao').textContent.replace('Valor proporcional: R$ ', ''));
    const valorSomar = parseFloat(document.getElementById('valorSomarAlteracao').value);
    const resultado = valorProporcional + valorSomar;
    document.getElementById('resultadoSomaAlteracao').textContent = `Valor total: R$ ${resultado.toFixed(2)}`;
}

// Eventos de soma com Enter
document.getElementById('valorSomarReativacao').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        somarReativacao();
    }
});

document.getElementById('valorSomarUpgrade').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        somarUpgrade();
    }
});

document.getElementById('valorSomarAlteracao').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        somarAlteracao();
    }
});

// Inicializa a exibição correta da seção de cálculo
atualizarTipoCalculo();
