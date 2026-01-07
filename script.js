// 1. Lista de perguntas
const perguntas = [
    "A dra realiza avaliação antes dos procedimentos?",
    "A dra realiza Harmonização Facial completa?",
    "A dra utiliza apenas produtos originais e aprovados pela Anvisa?",
    "A dra realiza aplicação de toxina botulínica (Botox)?",
    "A dra realiza preenchimento (lábios, mandíbula, bigode chinês etc.)?",
    "A dra realiza bioestimuladores de colágeno?",
    "A dra realiza skinbooster / hidratação injetável?",
    "A dra realiza lipo enzimática de papada?",
    "A dra realiza fios de PDO?",
    "A dra realiza microagulhamento / tratamentos de pele?",
];

// 2. Container do quiz
const quizContainer = document.getElementById("quiz-container");

// 3. Criar quiz
perguntas.forEach((texto, index) => {
    const div = document.createElement("div");
    div.className = "pergunta";

    const label = document.createElement("p");
    label.textContent = `${index + 1}. ${texto}`;

    const sim = criarRadio(index, "SIM");
    const nao = criarRadio(index, "NÃO");
    const depende = criarRadio(index, "DEPENDE");

    div.appendChild(label);
    div.appendChild(sim);
    div.appendChild(nao);
    div.appendChild(depende);

    quizContainer.appendChild(div);
});

// 4. Função para criar botões
function criarRadio(numPergunta, valor) {
    const label = document.createElement("label");
    const input = document.createElement("input");

    input.type = "radio";
    input.name = "pergunta_" + numPergunta;
    input.value = valor;

    label.appendChild(input);
    label.appendChild(document.createTextNode(" " + valor + " "));

    return label;
}

// 5. Enviar respostas ao clicar no botão
document.getElementById("enviar").addEventListener("click", () => {
    
    const respostas = {};

    perguntas.forEach((pergunta, index) => {
        const selecionada = document.querySelector(
            `input[name="pergunta_${index}"]:checked`
        );

        const valor = selecionada ? selecionada.value : "SEM RESPOSTA";

        respostas[pergunta] = valor;
    });

    console.log("RESPOSTAS COLETADAS:", respostas);

    enviarParaPlanilha(respostas);
});

// 6. Enviar para Google Sheets
function enviarParaPlanilha(respostas) {

    const url = "https://script.google.com/macros/s/AKfycbwllg4t66a-HRMLUQOtvTU-sNbgMJwTI-zmzJ80nzp5IPPVrr7GiHnVvz92ro6AYp3flw/exec";

    fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(respostas)
    })
    .then(() => {
    window.location.href = "confirmacao.html";
    
    })
    .catch((err) => {
        console.error("Erro ao enviar:", err);
        alert("❌ Erro ao enviar as respostas.");
    });
}
function doPost(e) {

  var ss = SpreadsheetApp.openById("ID_DA_SUA_PLANILHA");
  var sheet = ss.getSheetByName("Respostas");

  var dados = JSON.parse(e.postData.contents);

  var linha = [];

  for (var p in dados) {
    linha.push(dados[p]);
  }

  sheet.appendRow(linha);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
