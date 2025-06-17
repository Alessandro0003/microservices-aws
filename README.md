
# 🏗️ Microservices AWS Infrastructure 🚀

Este projeto é uma arquitetura de microserviços utilizando **Node.js**, **Docker**, **Pulumi**, e deploy na AWS. O repositório contém serviços independentes, infraestrutura como código e contratos de mensagens.

---

## 📂 Estrutura do Projeto

```
├── .github/workflows      → Pipelines CI/CD (GitHub Actions)
├── app-invoices/          → Microserviço de invoices (Node.js + DrizzleORM + RabbitMQ + Docker)
├── app-orders/            → Microserviço de orders ((Node.js + DrizzleORM + RabbitMQ + Docker)
├── contracts/             → Contratos compartilhados entre serviços
├── docker/                → Configurações auxiliares (ex.: Kong API Gateway)
├── infra/                 → Infraestrutura como código (Pulumi)
└── docker-compose.yml     → Orquestração local dos serviços
```

---

## 🚀 Tecnologias Utilizadas

- **Node.js** — Backend dos microserviços
- **DrizzleORM** — ORM responsável pela modelagem de tabelas, migrations e queries SQL 100% tipadas no TypeScript.
- **TypeScript** — Tipagem estática
- **Docker & Docker Compose** — Containers e orquestração local
- **Pulumi + TypeScript** — Infraestrutura como código
- **AWS** — Deploy e provisionamento
- **Kong Gateway** — Gerenciamento de API Gateway
- **RabbitMQ** — Gerenciamento de Mensageria entre os serviços
- **GitHub Actions** — CI/CD automatizado

---

## ⚙️ Rodando Localmente

### 🔥 Pré-requisitos
- Docker
- Node.js (v20+)
- Pulumi CLI
- AWS CLI (configurado)

### 🚩 Subindo os serviços localmente

```bash
docker-compose up --build
```

Acesse os serviços em:
- Orders: `http://localhost:3333`
- Invoices: `http://localhost:3334`
- Kong API Gateway (se configurado): `http://localhost:8000`

---

## 🏗️ Deploy da Infraestrutura (Pulumi)

### 🔐 Login no Pulumi

```bash
pulumi login
```

### 🚀 Deploy da infraestrutura na AWS

```bash
cd infra
npm install
pulumi up
```

> Isso cria recursos como VPC, ECS, ECR, Load Balancer, e outros definidos no código Pulumi.

---

## 🚚 Deploy dos Microserviços

> O deploy dos serviços está automatizado via **GitHub Actions**, mas pode ser feito manualmente:

### 🔥 Build e Push para ECR

```bash
docker build -t <nome-da-imagem> .
docker tag <nome-da-imagem> <aws_account_id>.dkr.ecr.<region>.amazonaws.com/<repo>
docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/<repo>
```

### 🛠️ Deploy no ECS

> Configurado via Pulumi no stack `infra/`.

---

## 🚦 CI/CD — GitHub Actions

O repositório possui automações para:
- Deploy de infraestrutura (Pulumi)
- Build, push e deploy dos microserviços
- Validações, builds e testes (opcional)

### 🔐 Secrets necessários no GitHub:

| Nome                   | Descrição                        |
| ---------------------- | -------------------------------- |
| `AWS_ACCESS_KEY_ID`    | Access Key da AWS                |
| `AWS_SECRET_ACCESS_KEY`| Secret Key da AWS                |
| `PULUMI_ACCESS_TOKEN`  | Token de acesso ao Pulumi        |

---

## 📜 Contratos (Contracts)

Pasta `/contracts/messages` armazena contratos compartilhados entre os microserviços para garantir consistência na comunicação.

---

## 💻 Estrutura dos Microserviços

Cada serviço (`app-orders` e `app-invoices`) possui:

- `package.json` e `package-lock.json` — Gerenciamento de dependências
- `Dockerfile` e `docker-compose.yml` — Containerização e orquestração local
- `src/` — Código fonte
- `drizzle.config.ts` — Configuração do ORM

---

## 🛡️ Boas Práticas e Segurança

- Gerenciamento de secrets via GitHub Actions e AWS Secrets Manager
- Versionamento de infraestrutura via Pulumi
- Isolamento dos ambientes (dev, staging, prod)

---

