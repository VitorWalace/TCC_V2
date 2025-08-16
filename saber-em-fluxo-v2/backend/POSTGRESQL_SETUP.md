# 🐘 Guia de Configuração PostgreSQL - Saber em Fluxo v2.0

## 📋 Por que PostgreSQL é Melhor?

✅ **Mais robusto e confiável**  
✅ **Funcionalidades avançadas (UUID, JSON, Full-text search)**  
✅ **Melhor performance para aplicações complexas**  
✅ **Usado por grandes empresas (Instagram, Spotify, Netflix)**  
✅ **Configuração mais simples que XAMPP**  

## 🚀 Instalação e Configuração

### **1. Baixar e Instalar PostgreSQL**

**Windows:**
1. Acesse: https://www.postgresql.org/download/windows/
2. Baixe o instalador oficial
3. Durante a instalação:
   - **Senha do superusuário**: `postgres` (anote!)
   - **Porta**: `5432` (padrão)
   - **Locale**: Deixe padrão
   - **Instalar Stack Builder**: ✅ Sim

### **2. Verificar Instalação**

**Abra o Command Prompt e teste:**
```bash
# Testar conexão
psql -U postgres -h localhost

# Se solicitar senha, digite: postgres
# Deve abrir o terminal do PostgreSQL: postgres=#
```

**Para sair do psql:** digite `\q`

### **3. Criar o Banco de Dados**

**Método 1 - Via pgAdmin (Interface Gráfica):**
1. Abra **pgAdmin** (instalado junto com PostgreSQL)
2. Conecte com usuário `postgres` e senha `postgres`
3. Clique direito em "Databases" → "Create" → "Database..."
4. Nome: `saber_em_fluxo_v2`
5. Clique "Save"

**Método 2 - Via Terminal:**
```bash
# Conectar ao PostgreSQL
psql -U postgres -h localhost

# Criar o banco
CREATE DATABASE saber_em_fluxo_v2;

# Listar bancos (para confirmar)
\l

# Sair
\q
```

### **4. Configuração do Backend**

**Arquivo `.env` já configurado:**
```env
# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saber_em_fluxo_v2
DB_USER=postgres
DB_PASSWORD=postgres
```

**⚠️ IMPORTANTE:** Se usou senha diferente na instalação, altere `DB_PASSWORD`

### **5. Instalar Dependências**

**No terminal do backend:**
```bash
# Navegar para o backend
cd "c:\Users\Pichau\OneDrive - Instituição Adventista de Ensino\Documentos\TCC_V2\saber-em-fluxo-v2\backend"

# Remover MySQL (se existir)
npm uninstall mysql2

# Instalar PostgreSQL
npm install pg @types/pg

# Verificar se instalou
npm list pg
```

### **6. Executar Migrações**

```bash
# Executar migração
npm run migrate:latest
```

**Resultado esperado:**
```
Batch 1 run: 1 migrations
```

### **7. Verificar se Funcionou**

**Via pgAdmin:**
1. Navegue até `saber_em_fluxo_v2` → Schemas → public → Tables
2. Deve ver as tabelas: `users` e `knex_migrations`

**Via Terminal:**
```bash
# Conectar ao banco
psql -U postgres -d saber_em_fluxo_v2

# Listar tabelas
\dt

# Ver estrutura da tabela users
\d users

# Sair
\q
```

### **8. Testar o Servidor**

```bash
# Iniciar servidor
npm run dev
```

**Deve mostrar:**
```
🚀 Saber em Fluxo v2.0 Backend iniciado!
📡 Servidor rodando em: http://localhost:5000
🌍 Ambiente: development
```

## ✅ Teste Completo

### **Health Check**
Acesse: http://localhost:5000/api/health

### **Registro de Usuário (Postman/Insomnia)**
```json
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "teste@exemplo.com",
  "password": "MinhaSenh@123",
  "first_name": "João",
  "last_name": "Silva"
}
```

### **Verificar no Banco**
```sql
-- Conectar: psql -U postgres -d saber_em_fluxo_v2
SELECT * FROM users;
```

## 🐛 Resolução de Problemas

### **Erro: "password authentication failed"**
- Verifique se a senha em `.env` está correta
- Tente redefinir senha do usuário postgres

### **Erro: "database does not exist"**
- Certifique-se de que criou o banco `saber_em_fluxo_v2`
- Verifique se o nome no `.env` está correto

### **Erro: "port 5432 already in use"**
- PostgreSQL já está rodando (isso é bom!)
- Verifique se outro serviço usa a porta 5432

### **Erro: "relation does not exist"**
- Execute a migração: `npm run migrate:latest`
- Verifique se a tabela foi criada no pgAdmin

## 🔧 Comandos Úteis

```bash
# PostgreSQL
psql -U postgres                 # Conectar como admin
psql -U postgres -d saber_em_fluxo_v2  # Conectar ao banco específico
\l                              # Listar databases
\dt                             # Listar tabelas
\d nome_tabela                  # Estrutura da tabela
\q                              # Sair

# Backend
npm run migrate:latest          # Executar migrações
npm run migrate:rollback        # Reverter última migração
npm run migrate:make nome       # Criar nova migração
npm run dev                     # Iniciar servidor
```

## 🎯 Vantagens do PostgreSQL

- **UUID nativo**: Não precisa de funções customizadas
- **JSON support**: Para dados complexos no futuro
- **Full-text search**: Para busca em cursos/aulas
- **Performance**: Muito superior para grandes volumes
- **Escalabilidade**: Cresce com a aplicação

---

✅ **Status**: PostgreSQL configurado e pronto para usar!  
🚀 **Próximo**: Testar autenticação e expandir funcionalidades!
