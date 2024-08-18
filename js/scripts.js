const maxPeriodos = 10;
let contadorPeriodos = 0;
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
    
    for (let i = id; i < contadorPeriodos; i++) {
        const periodoDiv = document.getElementById(`periodo${i + 1}`);
        if (periodoDiv) {
            periodoDiv.id = `periodo${i}`;
            document.getElementById(`dataInicial${i + 1}`).id = `dataInicial${i}`;
            document.getElementById(`dataFinal${i + 1}`).id = `dataFinal${i}`;
        }
    }
}

// Função para atualizar o tipo de cálculo
function atualizarTipoCalculo() {
    const tipoCalculo = document.getElementById('tipoCalculo').value;
    
    if (tipoCalculo === 'reativacao') {
        calcularComMaisUm = true;
        document.getElementById('tipoCalculoSelecionado').textContent = 'Tipo de Cálculo Selecionado: Reativação';
    } else if (tipoCalculo === 'alteracao') {
        calcularComMaisUm = false;
        document.getElementById('tipoCalculoSelecionado').textContent = 'Tipo de Cálculo Selecionado: Alteração de Vencimento';
    }
}

// Função para calcular os dias entre datas
function calcularDiasEntreDatas(dataInicial, dataFinal) {
    const [ano1, mes1, dia1] = dataInicial.split('-').map(Number);
    const [ano2, mes2, dia2] = dataFinal.split('-').map(Number);

    const dias1 = (ano1 * 360) + ((mes1 - 1) * 30) + dia1;
    const dias2 = (ano2 * 360) + ((mes2 - 1) * 30) + dia2;

    return calcularComMaisUm ? (dias2 - dias1) + 1 : (dias2 - dias1);
}

// Função para calcular o total de dias de utilização
document.getElementById('dateForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let totalDias = 0;
    for (let i = 0; i < contadorPeriodos; i++) {
        const dataInicial = document.getElementById(`dataInicial${i}`).value;
        const dataFinal = document.getElementById(`dataFinal${i}`).value;

        if (dataInicial && dataFinal) {
            const diasEntreDatas = calcularDiasEntreDatas(dataInicial, dataFinal);
            totalDias += diasEntreDatas;
        }
    }

    document.getElementById('resultado').textContent = `Total de dias de utilização: ${totalDias} dias.`;
});

// Função para calcular o valor proporcional
function calcularValorProporcional() {
    const totalDiasElement = document.getElementById('resultado').textContent;
    const valorTotal = parseFloat(document.getElementById('valorTotal').value);
    
    if (!totalDiasElement || isNaN(valorTotal)) {
        alert('Por favor, calcule o total de dias e insira um valor total.');
        return;
    }

    const totalDias = parseInt(totalDiasElement.replace('Total de dias de utilização: ', '').replace(' dias.', ''));
    if (isNaN(totalDias)) {
        alert('Total de dias inválido.');
        return;
    }

    const valorPorDia = valorTotal / 30;
    const valorCalculado = valorPorDia * totalDias;

    document.getElementById('valorCalculado').textContent = `Valor proporcional: R$ ${valorCalculado.toFixed(2)}`;
}

// Função para calcular a diferença de mensalidade
function calcularDiferencaMensalidade() {
    const novaMensalidade = parseFloat(document.getElementById('novaMensalidade').value);
    const antigaMensalidade = parseFloat(document.getElementById('antigaMensalidade').value);
    const totalDiasElement = document.getElementById('resultado').textContent;

    if (isNaN(novaMensalidade) || isNaN(antigaMensalidade)) {
        alert('Por favor, insira valores válidos para as mensalidades.');
        return;
    }

    if (!totalDiasElement) {
        alert('Por favor, calcule o total de dias antes de realizar este cálculo.');
        return;
    }

    const totalDias = parseInt(totalDiasElement.replace('Total de dias de utilização: ', '').replace(' dias.', ''));

    const diferenca = novaMensalidade - antigaMensalidade;
    const resultado = (diferenca / 30) * totalDias;

    document.getElementById('resultadoMensalidade').textContent = `Resultado da diferença: R$ ${resultado.toFixed(2)}`;
}

// Função para calcular a soma
function calcularSoma() {
    const valorSomar = parseFloat(document.getElementById('valorSomar').value);
    const opcaoSomar = document.getElementById('opcaoSomar').value;
    
    let resultadoOperacao = 0;

    if (isNaN(valorSomar)) {
        alert('Por favor, insira um valor válido para somar.');
        return;
    }

    if (opcaoSomar === 'proporcional') {
        const valorProporcionalElement = document.getElementById('valorCalculado').textContent;
        if (!valorProporcionalElement) {
            alert('Por favor, calcule o valor proporcional antes de realizar esta operação.');
            return;
        }
        const valorProporcional = parseFloat(valorProporcionalElement.replace('Valor proporcional: R$ ', ''));
        resultadoOperacao = valorSomar + valorProporcional;

    } else if (opcaoSomar === 'diferenca') {
        const valorDiferencaElement = document.getElementById('resultadoMensalidade').textContent;
        if (!valorDiferencaElement) {
            alert('Por favor, calcule a diferença de mensalidade antes de realizar esta operação.');
            return;
        }
        const valorDiferenca = parseFloat(valorDiferencaElement.replace('Resultado da diferença: R$ ', ''));
        resultadoOperacao = valorSomar + valorDiferenca;
    }

    document.getElementById('resultadoSoma').textContent = `Resultado Final: R$ ${resultadoOperacao.toFixed(2)}`;
}

// Função para alternar a visibilidade de seções
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const icon = section.previousElementSibling.querySelector('span');
    
    if (section.style.display === 'none' || section.style.display === '') {
        section.style.display = 'block';
        icon.innerHTML = '&#9650;'; // Muda a seta para cima quando a seção está aberta
    } else {
        section.style.display = 'none';
        icon.innerHTML = '&#9660;'; // Muda a seta para baixo quando a seção está fechada
    }
}

// Inicializa a adição do primeiro período ao carregar a página
adicionarPeriodo();
