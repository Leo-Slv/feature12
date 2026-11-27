// Funcionalidade 12: Conversor para maiúsculas.
// Objetivo: Converte texto para letras maiúsculas.
// Exemplo de entrada: { texto: 'GitHub Actions' }
// Regras: `texto` deve ser string; espaços, números e pontuação são preservados.

const implemented = true;

// Valida a entrada e converte o texto sem modificar o objeto recebido.
function execute(input) {
  const { texto } = input || {};
  if (typeof texto !== "string") {
    throw new Error("Texto deve ser string.");
  }
  // Usa o locale pt-BR para o resultado não depender do idioma da máquina.
  return { resultado: texto.toLocaleUpperCase("pt-BR") };
}

// Mantém o contrato de integração utilizado pela API central.
module.exports = {
  id: 12,
  name: "Conversor para maiúsculas",
  description: "Converte texto para letras maiúsculas.",
  implemented,
  execute
};
