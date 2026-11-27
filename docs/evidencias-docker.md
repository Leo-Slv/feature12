# Evidência do teste local com Docker

Teste executado em 27/11/2026 com o Docker Engine 29.2.1 (contêineres Linux), com o assistente de IA, antes do primeiro commit da entrega. Por isso a imagem tem apenas a tag `lab40:feature12`, sem SHA.

## Imagem

- Build: `docker build --pull -t lab40:feature12 .` (concluído; `npm ci --omit=dev` com 0 vulnerabilidades)
- ID: `sha256:fccb5e1c3c5baf60b7b4bab09d70678d870d01d0264731aec8ea872602a3aa37`
- Plataforma: `linux/amd64`; tamanho informado pelo Docker: 243 MB

## Contêiner

`docker run -d --name lab40-container -p 3000:3000 lab40:feature12`

```text
NAMES             IMAGE             STATUS        PORTS
lab40-container   lab40:feature12   Up 1 second   0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
```

| Requisição | Resposta |
|------------|----------|
| `GET /health` | 200 `{"status":"ok","application":"LAB40"}` |
| `POST /api/features/12` com `{"texto":"GitHub Actions"}` | 200 `{"id":12,"name":"Conversor para maiúsculas","result":{"resultado":"GITHUB ACTIONS"}}` |
| `POST /api/features/12` com `{"texto":123}` | 400 `{"error":"Texto deve ser string."}` |
| `GET /` | 200 |

## Logs

```text
> lab40@1.0.0 start
> node src/server.js

LAB40 disponível na porta 3000
```

Ao final, o contêiner foi parado e removido (`docker stop` e `docker rm`).

## Exportação e importação

Executadas depois, também em 27/11/2026 e com o assistente de IA, gravando o `.tar` em uma pasta temporária:

- `docker save lab40:feature12 -o lab40-feature12.tar`: gerou um arquivo de cerca de 60 MB.
- `docker load -i lab40-feature12.tar`: retornou `Loaded image: lab40:feature12`, com o mesmo ID listado acima.

A imagem não foi removida antes do `docker load`; o teste confirma que o arquivo é aceito, mas não simula uma máquina sem a imagem.
