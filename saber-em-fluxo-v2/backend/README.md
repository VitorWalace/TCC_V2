# 🎓 Saber em Fluxo v2.0 - Backend

Uma plataforma de e-learning moderna e escalável construída com Node.js, TypeScript e PostgreSQL.

## 🚀 Stack Tecnológica

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Knex.js
- **Real-time**: Socket.IO
- **Authentication**: JWT
- **Security**: Helmet, CORS, Rate Limiting
- **File Storage**: Cloudinary

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/     # Controladores da API
│   ├── database/       # Configuração, migrações e seeds
│   ├── middlewares/    # Middlewares personalizados
│   ├── models/         # Modelos de dados
│   ├── routes/         # Definição das rotas
│   ├── services/       # Lógica de negócio
│   ├── types/          # Tipos TypeScript
│   ├── utils/          # Funções utilitárias
│   ├── app.ts          # Configuração do Express
│   └── server.ts       # Ponto de entrada da aplicação
├── dist/               # Código compilado (gerado)
├── knexfile.ts         # Configuração do Knex
├── package.json        # Dependências e scripts
└── tsconfig.json       # Configuração do TypeScript
```

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- Node.js (v18 ou superior)
- PostgreSQL (v13 ou superior)
- npm ou yarn

### Instalação

1. **Clone o repositório e navegue para o backend:**
   ```bash
   cd backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=saber_em_fluxo_v2
   DB_USER=postgres
   DB_PASSWORD=sua_senha
   
   # Server
   NODE_ENV=development
   PORT=5000
   
   # JWT
   JWT_SECRET=sua_chave_secreta_muito_segura
   JWT_EXPIRES_IN=7d
   
   # Cloudinary (opcional)
   CLOUDINARY_CLOUD_NAME=seu_cloud_name
   CLOUDINARY_API_KEY=sua_api_key
   CLOUDINARY_API_SECRET=seu_api_secret
   ```

4. **Configure o banco de dados PostgreSQL:**
   ```sql
   CREATE DATABASE saber_em_fluxo_v2;
   ```

5. **Execute as migrações:**
   ```bash
   npm run migrate:latest
   ```

6. **Inicie o servidor em modo desenvolvimento:**
   ```bash
   npm run dev
   ```

O servidor estará rodando em `http://localhost:5000`

## 📜 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Inicia o servidor em modo produção
- `npm run migrate:latest` - Executa as migrações mais recentes
- `npm run migrate:rollback` - Desfaz a última migração
- `npm run migrate:make nome_da_migração` - Cria uma nova migração
- `npm run seed:run` - Executa os seeds

## 🔐 Segurança

O backend implementa múltiplas camadas de segurança:

- **Helmet**: Configura headers de segurança
- **CORS**: Controla o acesso cross-origin
- **Rate Limiting**: Previne ataques de força bruta
- **JWT**: Autenticação segura baseada em tokens
- **Validação**: Joi para validação de dados de entrada
- **Hash de Senhas**: bcrypt para hash seguro

## 🗄️ Base de Dados

### Migrações

As migrações são executadas automaticamente e incluem:

- Tabela `users` com campos completos para perfis de utilizador
- Índices otimizados para performance
- Constraints de integridade referencial

### Schema da Tabela Users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(500),
  phone VARCHAR(20),
  role user_role DEFAULT 'student',
  is_email_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔌 WebSockets (Socket.IO)

O servidor suporta comunicação em tempo real para:

- Sistema de chat entre utilizadores
- Notificações push
- Atualizações de estado em tempo real

## 📈 Monitoramento

### Health Check

Endpoint de verificação de saúde da API:
```
GET /api/health
```

Resposta:
```json
{
  "success": true,
  "message": "Saber em Fluxo API v2.0 está funcionando!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

## 🚀 Deploy

### Produção

1. **Configure as variáveis de ambiente de produção**
2. **Compile o código:**
   ```bash
   npm run build
   ```
3. **Execute as migrações:**
   ```bash
   npm run migrate:latest
   ```
4. **Inicie o servidor:**
   ```bash
   npm start
   ```

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Saber em Fluxo v2.0** - Construído com 💙 para democratizar a educação online.
