# Configuração de Ambiente — Minhas Contas

Este README descreve os ambientes **dev** e **prod**, a estrutura dos arquivos `.yml` e as variáveis de ambiente usadas por backend, frontend e banco.

---

## Estrutura do projeto
É importante que o projeto siga na estrutura abaixo: caso contrário, é possível que o serviço não funcione como esperado.

Repositórios dependentes:
 - Front: https://github.com/GuiSmith/minhas-contas-frontend
 - Back: https://github.com/GuiSmith/minhas-contas-backend

```
.
├── backend/
├── frontend/
├── banco/
├── docker-compose-dev.yml
├── docker-compose-prod.yml
├── .env
├── .env.dev
├── .env.prod
└── README.md
```

---

## Arquivos de variáveis de ambiente

A stack utiliza três arquivos `.env` com responsabilidades distintas:

### `.env` (compartilhado)
Variáveis comuns a todos os ambientes — credenciais e dados básicos do banco.

```
MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=
MYSQL_USER=
MYSQL_PASSWORD=
```

### `.env.dev` e `.env.prod`

`.env.dev` contém as configurações do ambiente local de desenvolvimento.

`.env.prod` contém as configurações do ambiente de produção que será usado no servidor.

Configuração de ambos arquivos:
 - DB_PORT: define a porta local que escutará o serviço do banco de dados.
 - DB_HOST: nome do serviço de DB presente no arquivo de configuração `.yml`
 - BACK_PORT: define a porta local que escutará o serviço de back-end
 - VITE_API_URL: define a URL que o front usará para suas requisições API

OBS: Ambas variáveis de porta (sufixo `_PORT`) são usadas pelo arquivo de configuração `.yml`

### `.env.dev` (desenvolvimento)
Configurações específicas para ambiente local de desenvolvimento.

O arquivo final ficará assim:
```
DB_PORT=
DB_HOST=db-dev
BACK_PORT=5000
VITE_API_URL=http://localhost:5000/
```

### `.env.prod` (produção)
Configurações específicas para prod.

```
DB_PORT=
DB_HOST=db
BACK_PORT=3000
VITE_API_URL=http://127.0.0.1/api/
```

Importante: cada serviço no docker-compose lê os arquivos declarados em `env_file`, mesclando `.env` com `.env.dev` ou `.env.prod`.

---

## Aqruivos de configuração dos serviços

A stack usa 2 arquivo de configuração de serviços

### Ambiente de desenvolvimento

Arquivo: `docker-compose-dev.yml`

Serviços principais:

- `db-dev`
    - Imagem: `mariadb:11.4`
    - Carrega `.env` + `.env.dev`
    - Porta: `${DB_PORT}`
    - Healthcheck garante que o backend só suba quando o banco estiver pronto

- `frontend-dev`
    - Base: `node:latest`
    - Monta `./frontend`
    - Executa `npm i` e `npm run dev -- --host`
    - Porta: `5173`

- `backend-dev`
    - Base: `node:latest`
    - Monta `./backend`
    - Depende do banco via healthcheck
    - Carrega `.env` + `.env.dev`
    - Porta: `${BACK_PORT}`
    - Executa `init.sh dev`

Executar dev:
```
docker compose --env-file .env.dev -f docker-compose-dev.yml up --build
```

---

### Ambiente de produção

Arquivo: `docker-compose-prod.yml`

Serviços principais:

- `db`
    - Imagem: `mariadb:11.4`
    - Carrega `.env` + `.env.prod`
    - Porta: `${DB_PORT}`
    - Healthcheck garante que o backend só suba quando o banco estiver pronto

- `backend`
    - Build do Dockerfile em `./backend`
    - Carrega `.env` + `.env.prod`
    - Depende do healthcheck do banco
    - Porta: `${BACK_PORT}`
    - Executa `bash init.sh prod`

- `frontend`
    - Build do Dockerfile em `./frontend`
    - Porta: `80:80`
    - Depende do backend

Executar prod:
```
docker compose --env-file .env.prod -f docker-compose-prod.yml up --build -d
```

---

## Observações

Configuração pensada para manter ambientes isolados, previsíveis e fáceis de levantar para desenvolvimento e produção.