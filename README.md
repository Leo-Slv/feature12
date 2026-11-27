# LAB40 – Laboratório de Funcionalidades Web

Projeto-base para avaliação prática de Integração e Entrega Contínua (CI/CD).

## Requisitos
- Node.js 20.19+, 22.13+ ou 24+, exigido pelas ferramentas de desenvolvimento (o CI usa o 22).
- npm.
- Docker, para construir e testar a imagem.

## Executar localmente
```bash
npm install
npm start
```
Acesse http://localhost:3000. Para desenvolvimento com reinicialização automática: `npm run dev`.

## Endpoints
- `GET /health`: verificação de disponibilidade.
- `GET /api/features`: lista as 40 funcionalidades e seus estados.
- `POST /api/features/:id`: executa uma funcionalidade, recebendo JSON no corpo.

Exemplo:
```bash
curl -X POST http://localhost:3000/api/features/1 -H "Content-Type: application/json" -d '{"valor":200,"percentual":15}'
```

## Estrutura
```text
feature12/
├── .github/
│   └── workflows/
│       ├── cd.yml
│       └── ci.yml
├── docs/
│   ├── evidencias-docker.md
│   └── roteiro-testes-manuais.md
├── public/
├── scripts/
│   └── smoke.js
├── src/
│   ├── app.js
│   ├── server.js
│   └── features/
├── test/
│   └── feature12.test.js
├── .dockerignore
├── .gitignore
├── .prettierrc.json
├── Dockerfile
├── eslint.config.js
├── package.json
└── package-lock.json
```

## Contrato de cada módulo
Cada arquivo `src/features/featureNN.js` exporta `id`, `name`, `description`, `implemented` e `execute(input)`.

1. Implemente `execute(input)`.
2. Valide os dados recebidos.
3. Retorne um objeto serializável em JSON.
4. Trate entradas inválidas lançando `Error` com mensagem clara.
5. Depois de implementar e validar, altere `implemented` para `true`.
6. Não altere o contrato dos outros módulos nem a API central sem autorização.

Enquanto `implemented` for `false`, a API retorna HTTP 501 para aquele módulo.

## Funcionalidade implementada: 12 – Conversor para maiúsculas
Entrada `{ "texto": "GitHub Actions" }`, saída `{ "resultado": "GITHUB ACTIONS" }`.

## Testes e qualidade
```bash
npm ci
npm run format:check   # formatação (npm run format corrige)
npm run lint           # análise estática
npm test               # testes automatizados (node:test)
npm run test:spec      # mesmos testes, com relatório detalhado
npm run test:smoke     # sobe o servidor na porta 3100 e valida a API
npm audit --audit-level=high
```
Roteiro manual: [docs/roteiro-testes-manuais.md](docs/roteiro-testes-manuais.md).

## Decisões técnicas
- **Locale:** `toLocaleUpperCase('pt-BR')`, para o resultado não depender do idioma da máquina.
- **Validação:** `texto` precisa ser string, inclusive vazia. Campo ausente ou de outro tipo lança `Error`, e a API responde 400.
- **Preservação:** espaços, números, pontuação e símbolos são mantidos, e a entrada não é modificada.
- **Testes:** usam o `node:test`, nativo do Node.js, sem dependência externa.
- **Formatação:** o Prettier verifica apenas os arquivos desta entrega e o `eslint.config.js`, para não reescrever os demais módulos.

## Dependências de desenvolvimento
A aplicação não tem dependências de produção.

| Pacote | Justificativa |
|--------|---------------|
| `eslint`, `@eslint/js`, `globals` | Análise estática exigida pela atividade |
| `prettier` | Etapa de formatação do CI |

**Auditoria (27/11/2026):** `npm audit --audit-level=high` retornou `found 0 vulnerabilities`; nenhuma correção foi necessária.

## CI e Docker
O workflow [.github/workflows/ci.yml](.github/workflows/ci.yml) roda em `push` e `pull_request`: formatação, lint, testes, smoke test, auditoria, build da imagem, validação do contêiner e publicação da imagem como artefato.

No CI, a imagem recebe as tags `lab40:feature12` e `lab40:<SHA>`, em que o SHA é o commit que o workflow usou (em `pull_request`, é o commit de merge temporário do GitHub).

Para o build local, faça o commit antes, para o SHA corresponder ao código da imagem. No PowerShell:

```powershell
$sha = git rev-parse HEAD
docker build --pull -t lab40:feature12 -t "lab40:$sha" .
```

Depois, execute e valide o contêiner:

```bash
docker run -d --name lab40-container -p 3000:3000 lab40:feature12
curl --fail http://localhost:3000/health
docker logs lab40-container
docker stop lab40-container
docker rm lab40-container
```

Para exportar a imagem para um arquivo `.tar` e importá-la novamente:

```bash
docker save lab40:feature12 -o lab40-feature12.tar
docker load -i lab40-feature12.tar
```

O arquivo `.tar` não é versionado (está no `.gitignore`). Evidência do teste local: [docs/evidencias-docker.md](docs/evidencias-docker.md).

## Importante
O repositório-base foi entregue sem testes, análise estática, CI e CD; esses itens foram adicionados nesta entrega.

O [CD simulado](.github/workflows/cd.yml) roda em `push` na `main`. Ele testa, constrói e valida a imagem e publica o artefato `lab40-delivery-record`, com o `.tar` e o `deployment-record.txt` (repositório, referência, SHA e tag). Não publica em registry nem implanta em servidor. O YAML foi criado nesta entrega a partir do GUIA, pois não foi encontrado um arquivo fornecido pelo professor.

O servidor escuta `process.env.PORT` e `0.0.0.0`, e a aplicação não persiste dados em disco.
