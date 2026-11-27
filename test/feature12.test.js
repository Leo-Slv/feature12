// Testes de referência – Feature 12
// Execute com: node --test test/feature12.test.js
const test = require("node:test");
const assert = require("node:assert/strict");
const feature = require("../src/features/feature12");

test("converte letras para maiúsculas", () => {
  assert.equal(feature.execute({ texto: "GitHub Actions" }).resultado, "GITHUB ACTIONS");
});

test("preserva espaços, pontuação, números e trata acentos", () => {
  assert.equal(feature.execute({ texto: "ação 123!" }).resultado, "AÇÃO 123!");
  assert.equal(feature.execute({ texto: "" }).resultado, "");
});

test("rejeita entrada não textual", () => {
  assert.throws(() => feature.execute({ texto: false }), { name: "Error" });
});

// Testes complementares: casos do Caderno de Enunciados.
test("caso tipico: retorna o objeto no formato do contrato", () => {
  assert.deepEqual(feature.execute({ texto: "GitHub Actions" }), {
    resultado: "GITHUB ACTIONS"
  });
});

test("converte texto todo em minusculas", () => {
  assert.equal(feature.execute({ texto: "fatec" }).resultado, "FATEC");
});

test("preserva espacos, numeros e simbolos", () => {
  assert.equal(feature.execute({ texto: "  ci/cd 123!  " }).resultado, "  CI/CD 123!  ");
});

test("nao modifica o objeto de entrada", () => {
  const entrada = Object.freeze({ texto: "node" });
  feature.execute(entrada);
  assert.deepEqual(entrada, { texto: "node" });
});

test("rejeita tipo incorreto, campo ausente e entrada ausente", () => {
  const invalidas = [
    { texto: 123 },
    { texto: false },
    { texto: null },
    { texto: [] },
    {},
    null,
    undefined
  ];
  for (const entrada of invalidas) {
    assert.throws(() => feature.execute(entrada), {
      name: "Error",
      message: "Texto deve ser string."
    });
  }
});
