const test = require("node:test");
const assert = require("node:assert/strict");
const feature = require("../src/features/feature12");

test("caso tipico: converte para maiusculas", () => {
  assert.deepEqual(feature.execute({ texto: "GitHub Actions" }), {
    resultado: "GITHUB ACTIONS"
  });
});

test("converte texto todo em minusculas", () => {
  assert.equal(feature.execute({ texto: "fatec" }).resultado, "FATEC");
});

test("trata acentos", () => {
  assert.equal(feature.execute({ texto: "ação é útil" }).resultado, "AÇÃO É ÚTIL");
});

test("limite: texto vazio continua vazio", () => {
  assert.equal(feature.execute({ texto: "" }).resultado, "");
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
