# Mech - Plataforma de Agendamentos Médicos

Aplicação Fullstack TypeScript para agendamento de consultas médicas, com suporte a PWA (Progressive Web App) para uso mobile.

## 🏗️ Arquitetura

- **Backend**: Node.js + Express + TypeScript + MongoDB
- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Admin**: React + TypeScript + Vite + TailwindCSS
- **Banco de Dados**: MongoDB
- **Containerização**: Docker + Docker Compose
- **Proxy Reverso**: Nginx

## 📋 Pré-requisitos

- Docker (versão 20.10 ou superior)
- Docker Compose (versão 2.0 ou superior)
- Git

## 🚀 Como Rodar com Docker

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd MechFullStack
```

### 2. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure as variáveis conforme necessário:

```env
# MongoDB
MONGO_PORT=27017

# Backend
BACKEND_PORT=4000
MONGODB_URI=mongodb://mongo:27017
MONGODB_DB_NAME=mech
JWT_SECRET=seu-jwt-secret-super-seguro
ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=admin
CLOUDINARY_NAME=seu-cloudinary-name
CLOUDINARY_API_KEY=sua-api-key
CLOUDINARY_SECRET_KEY=seu-secret-key
STRIPE_SECRET_KEY=sua-stripe-key
RAZORPAY_KEY_ID=sua-razorpay-key-id
RAZORPAY_KEY_SECRET=sua-razorpay-secret
CURRENCY=USD
NODE_ENV=production

# Frontend
FRONTEND_BACKEND_URL=/api

# Admin
ADMIN_BACKEND_URL=/api

# Nginx
NGINX_PORT=8080
NGINX_ADMIN_PORT=8081
```

**Importante**: 
- Gere um `JWT_SECRET` seguro em produção (use uma string aleatória longa)
- Configure as credenciais do Cloudinary se desejar upload de imagens
- Configure as chaves de pagamento (Stripe/Razorpay) se desejar processar pagamentos

### 3. Construa e inicie os containers

```bash
docker compose up -d --build
```

Este comando irá:
- Construir as imagens Docker de todos os serviços
- Iniciar MongoDB, Backend, Frontend, Admin e Nginx
- Criar a rede interna do Docker para comunicação entre serviços

### 4. Acesse a aplicação

Após alguns segundos (aguarde os healthchecks), acesse:

- **Frontend (PWA)**: http://localhost:8080
- **Admin Panel**: http://localhost:8080/admin ou http://localhost:8081
- **API Backend**: http://localhost:8080/api
- **Documentação API (Swagger)**: http://localhost:8080/api/docs

### 5. Popular o banco de dados (Opcional)

Para criar dados de exemplo (admin, usuário teste e médicos):

```bash
docker compose exec backend npm run seed
```

Ou usando o Makefile:

```bash
make seed
```

## 📱 PWA (Progressive Web App)

A aplicação está configurada como PWA e pode ser instalada no celular:

### Frontend
- Acesse http://localhost:8080 no navegador mobile
- O navegador oferecerá a opção de "Adicionar à tela inicial"
- Funciona offline após o primeiro carregamento (cache de assets)

### Admin
- Acesse http://localhost:8080/admin ou http://localhost:8081
- Também pode ser instalado como PWA

## 🛠️ Comandos Úteis

### Ver logs dos serviços

```bash
docker compose logs -f
```

### Ver logs de um serviço específico

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f admin
```

### Parar os serviços

```bash
docker compose down
```

### Parar e remover volumes (limpar dados do MongoDB)

```bash
docker compose down -v
```

### Reconstruir após mudanças no código

```bash
docker compose up -d --build
```

### Ver status dos serviços

```bash
docker compose ps
```

## 📁 Estrutura do Projeto

```
MechFullStack/
├── backend/              # API Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/       # Configurações (MongoDB, Cloudinary)
│   │   ├── controllers/  # Controllers da API
│   │   ├── middleware/   # Middlewares (auth, multer)
│   │   ├── models/       # Modelos Mongoose
│   │   ├── routes/       # Rotas da API
│   │   └── server.ts      # Servidor Express
│   ├── .env.example      # Exemplo de variáveis de ambiente
│   └── package.json
├── frontend/             # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── context/       # Context API
│   │   ├── pages/         # Páginas da aplicação
│   │   └── main.tsx       # Entry point
│   ├── public/           # Assets públicos (incluindo ícones PWA)
│   ├── .env.example
│   └── vite.config.js    # Configuração Vite + PWA
├── admin/                # Painel Admin React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── main.tsx
│   ├── .env.example
│   └── vite.config.js
├── docker/               # Dockerfiles centralizados
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── admin.Dockerfile
├── docker-compose.yml    # Orquestração dos serviços
├── nginx.conf           # Configuração do Nginx
├── .env.example         # Variáveis de ambiente do Docker Compose
└── README.md
```

## 🔐 Segurança

### Em Produção:

1. **JWT_SECRET**: Use uma chave longa e aleatória (mínimo 32 caracteres)
2. **ADMIN_PASSWORD**: Altere a senha padrão do admin
3. **MongoDB**: Configure autenticação no MongoDB
4. **HTTPS**: Use HTTPS em produção (configure certificado SSL no Nginx)
5. **CORS**: Ajuste as configurações de CORS no backend conforme necessário
6. **Variáveis de Ambiente**: Nunca commite o arquivo `.env` no Git

## 🐛 Troubleshooting

### Serviços não iniciam

Verifique os logs:
```bash
docker compose logs
```

### MongoDB não conecta

Verifique se o serviço está saudável:
```bash
docker compose ps
```

Aguarde alguns segundos após o início para os healthchecks completarem.

### Porta já em uso

Se as portas 8080, 8081, 4000 ou 27017 estiverem em uso, altere no `.env`:
```env
NGINX_PORT=8082
BACKEND_PORT=4001
MONGO_PORT=27018
```

### Erro de build

Limpe os containers e volumes:
```bash
docker compose down -v
docker compose up -d --build
```

## 📝 Variáveis de Ambiente

### Backend (.env.example em backend/)

- `MONGODB_URI`: URI de conexão do MongoDB
- `MONGODB_DB_NAME`: Nome do banco de dados
- `PORT`: Porta do servidor backend
- `JWT_SECRET`: Chave secreta para JWT
- `ADMIN_EMAIL`: Email do administrador
- `ADMIN_PASSWORD`: Senha do administrador
- `CLOUDINARY_NAME`: Nome da conta Cloudinary
- `CLOUDINARY_API_KEY`: API Key do Cloudinary
- `CLOUDINARY_SECRET_KEY`: Secret Key do Cloudinary
- `STRIPE_SECRET_KEY`: Chave secreta do Stripe
- `RAZORPAY_KEY_ID`: Key ID do Razorpay
- `RAZORPAY_KEY_SECRET`: Secret Key do Razorpay
- `CURRENCY`: Moeda para pagamentos (USD, BRL, etc)

### Frontend/Admin (.env.example)

- `VITE_BACKEND_URL`: URL base da API (ex: `/api`)

## 🚢 Deploy em Produção

1. Configure um servidor com Docker instalado
2. Clone o repositório
3. Configure o arquivo `.env` com valores de produção
4. Execute `docker compose up -d --build`
5. Configure um domínio e apontamento DNS
6. Configure SSL/TLS (Let's Encrypt recomendado)
7. Configure backup automático do MongoDB

## 📄 Licença

ISC

## 👥 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

---

**Desenvolvido com ❤️ para facilitar agendamentos médicos**
