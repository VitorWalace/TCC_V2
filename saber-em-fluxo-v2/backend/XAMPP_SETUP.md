# 🗄️ Guia de Configuração do Banco de Dados MySQL com XAMPP

## 📋 Pré-requisitos

1. **XAMPP instalado** - Baixe em: https://www.apachefriends.org/
2. **Backend do Saber em Fluxo v2.0 funcionando**

## 🚀 Configuração Passo a Passo

### **1. Iniciar o XAMPP**
- Abra o painel de controle do XAMPP
- Inicie os serviços **Apache** e **MySQL**
- Verifique se ambos estão com status "Running" (verde)

### **2. Criar o Banco de Dados**
- Acesse: http://localhost/phpmyadmin
- Clique em "**Novo**" no lado esquerdo
- Nome da base de dados: `saber_em_fluxo_v2`
- Clique em "**Criar**"

### **3. Configurar Variáveis de Ambiente**
No arquivo `.env` do backend, configure:

```env
# Database Configuration (MySQL/XAMPP)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=saber_em_fluxo_v2
DB_USER=root
DB_PASSWORD=

# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# JWT Configuration (IMPORTANTE: Altere esta chave!)
JWT_SECRET=minha_chave_super_secreta_e_unica_123456
JWT_EXPIRES_IN=7d
```

⚠️ **IMPORTANTE**: Altere a `JWT_SECRET` para uma chave única e segura!

### **4. Executar Migrations**
No terminal do backend:

```bash
# Navegar para o backend
cd saber-em-fluxo-v2\backend

# Executar as migrations
npm run migrate:latest
```

### **5. Verificar se a Tabela foi Criada**
- Acesse: http://localhost/phpmyadmin
- Selecione a base de dados `saber_em_fluxo_v2`
- Deve ver a tabela `users` com todos os campos

## 🔧 Comandos Úteis

```bash
# Ver todas as migrations disponíveis
npm run migrate:latest

# Reverter última migration
npm run migrate:rollback

# Criar nova migration
npm run migrate:make nome_da_migration

# Executar seeds (dados de teste)
npm run seed:run
```

## ✅ Teste de Funcionamento

### **Verificar Conexão:**
1. Servidor rodando: `npm run dev`
2. Acessar: http://localhost:5000/api/health
3. Deve retornar: Status 200 com mensagem de sucesso

### **Testar Endpoints de Autenticação:**

**Registro de Usuário:**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "teste@exemplo.com",
  "password": "MinhaSenh@123",
  "first_name": "João",
  "last_name": "Silva"
}
```

**Login:**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "teste@exemplo.com",
  "password": "MinhaSenh@123"
}
```

## 🐛 Resolução de Problemas

### **Erro: "Access denied for user 'root'"**
- Verifique se o MySQL está rodando no XAMPP
- Confirme se a senha está vazia (`DB_PASSWORD=`)
- Reinicie o serviço MySQL no XAMPP

### **Erro: "Database does not exist"**
- Certifique-se de que criou a base de dados `saber_em_fluxo_v2`
- Verifique se o nome está correto no arquivo `.env`

### **Erro: "Cannot connect to MySQL"**
- Verifique se a porta 3306 não está bloqueada
- Confirme se `DB_HOST=localhost`
- Reinicie o XAMPP completamente

### **Erro de Migration**
- Verifique se a tabela `knex_migrations` existe
- Execute: `npm run migrate:latest` novamente
- Se persistir, delete a tabela e execute novamente

## 📊 Estrutura da Tabela Users

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  bio TEXT NULL,
  avatar_url VARCHAR(500) NULL,
  phone VARCHAR(20) NULL,
  role ENUM('student', 'instructor', 'admin') DEFAULT 'student',
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔐 Segurança

- **JWT_SECRET**: Use uma chave longa e única
- **Passwords**: São hasheados com bcrypt (12 rounds)
- **Validação**: Joi valida todos os inputs
- **Rate Limiting**: Proteção contra ataques de força bruta

---

✅ **Status**: Sistema de autenticação pronto para usar!
📧 **Próximo**: Testar endpoints e criar frontend
