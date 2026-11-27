// Smoke test: sobe o servidor e faz chamadas reais. Usa a porta 3100 para nao colidir com o npm start.
const { spawn } = require("node:child_process");
const assert = require("node:assert/strict");
const path = require("node:path");

const PORT = 3100;
const BASE = `http://localhost:${PORT}`;

async function esperarServidor(servidor) {
  for (let tentativa = 0; tentativa < 40; tentativa++) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    if (servidor.exitCode !== null) {
      throw new Error("O servidor encerrou antes de responder.");
    }
    try {
      return await fetch(`${BASE}/health`);
    } catch {
      // Ainda subindo: tenta de novo.
    }
  }
  throw new Error("O servidor nao respondeu em 10 segundos.");
}

async function main() {
  // Se algo ja responde na porta, o teste validaria o processo errado.
  const ocupada = await fetch(`${BASE}/health`).then(
    () => true,
    () => false
  );
  if (ocupada) {
    throw new Error(`A porta ${PORT} ja esta em uso. Encerre o outro processo.`);
  }

  const servidor = spawn(process.execPath, [path.join("src", "server.js")], {
    stdio: "inherit",
    env: { ...process.env, PORT: String(PORT) }
  });
  try {
    const health = await esperarServidor(servidor);
    assert.equal(health.status, 200);
    assert.equal((await health.json()).status, "ok");

    const lista = await fetch(`${BASE}/api/features`);
    assert.equal(lista.status, 200);
    const { items } = await lista.json();
    assert.equal(items.length, 40);
    assert.equal(items.find((item) => item.id === 12).implemented, true);

    const resposta = await fetch(`${BASE}/api/features/12`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: "GitHub Actions" })
    });
    assert.equal(resposta.status, 200);
    assert.equal((await resposta.json()).result.resultado, "GITHUB ACTIONS");

    const invalida = await fetch(`${BASE}/api/features/12`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: 123 })
    });
    assert.equal(invalida.status, 400);

    console.log("Smoke test aprovado.");
  } finally {
    servidor.kill();
  }
}

main().catch((erro) => {
  console.error(erro);
  process.exitCode = 1;
});
