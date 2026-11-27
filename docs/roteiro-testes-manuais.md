# Roteiro de testes manuais – Feature 12 (Conversor para maiúsculas)

## Preparação

Execute `npm ci` e `npm start`. Os exemplos abaixo usam o PowerShell, em um segundo terminal.

## Passos pela API

| # | Ação | Resultado esperado |
|---|------|--------------------|
| 1 | `GET /health` | HTTP 200, `status: "ok"` |
| 2 | `GET /api/features` | Item 12 com `implemented: true` |
| 3 | `POST /api/features/12` com `{"texto":"GitHub Actions"}` | HTTP 200, `result.resultado: "GITHUB ACTIONS"` |
| 4 | Mesmo endpoint com `{"texto":"ação 123!"}` | HTTP 200, `"AÇÃO 123!"` |
| 5 | Mesmo endpoint com `{"texto":""}` | HTTP 200, `""` |
| 6 | Mesmo endpoint com `{"texto":123}` | HTTP 400, `"Texto deve ser string."` |
| 7 | `GET /health` após o erro | HTTP 200: o servidor continua ativo |

Exemplo do passo 3:

```powershell
$body = @{ texto = 'GitHub Actions' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/features/12 -ContentType 'application/json' -Body $body
```

No Windows PowerShell 5.1, envie o passo 4 como bytes UTF-8 para preservar os acentos:

```powershell
$body = [Text.Encoding]::UTF8.GetBytes('{"texto":"ação 123!"}')
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/features/12 -ContentType 'application/json; charset=utf-8' -Body $body
```

## Passo pela interface web

8. Abra http://localhost:3000, selecione a funcionalidade 12, mantenha o JSON de exemplo e clique em **Executar requisição**. Esperado: cartão marcado como **Implementada** e resposta com `"resultado": "GITHUB ACTIONS"`.

## Registro da execução

| Passos | Como foi executado | Resultado |
|--------|--------------------|-----------|
| 1 a 7 | Script Node contra o servidor real, em 27/11/2026, Node 24.14.0, porta 3101 | Todos com o status e o resultado esperados |
| 8 | Executado pelo estudante na interface web, em 27/11/2026 | Aprovado: HTTP 200, `GITHUB ACTIONS` e cartão 12 como **Implementada** (captura de tela do estudante, não versionada) |
