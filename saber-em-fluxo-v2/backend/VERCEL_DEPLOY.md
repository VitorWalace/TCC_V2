# 🚀 Guia de Deploy - Desenvolvimento Local + Vercel

## 🎯 **Estratégia Híbrida Perfeita**

### **Desenvolvimento Local:** SQLite (Zero configuração)
### **Produção Vercel:** PostgreSQL (Grátis + Robusto)

---

## 📱 **FASE 1: Desenvolvimento Local (SQLite)**

### **Vantagens:**
✅ **Zero instalação** - Funciona imediatamente  
✅ **Arquivo único** - `database.db`  
✅ **Fácil reset** - Só deletar o arquivo  
✅ **Rápido para prototipar**  

### **Configuração:**
1. **Instalar dependências:**
```bash
cd backend
npm install sqlite3 pg
```

2. **Executar migração:**
```bash
npm run migrate:latest
```

3. **Testar:**
```bash
npm run dev
```

---

## 🌐 **FASE 2: Deploy no Vercel (PostgreSQL)**

### **1. Criar Conta Vercel:**
- Acesse: https://vercel.com
- Conecte com GitHub
- É grátis!

### **2. Configurar PostgreSQL:**
**No dashboard Vercel:**
1. Vá em **Storage** → **Create Database**
2. Escolha **Postgres**
3. Nome: `saber-em-fluxo-db`
4. Região: Choose closest to users

### **3. Obter String de Conexão:**
Vercel fornecerá automaticamente:
```env
POSTGRES_URL="postgresql://username:password@host:port/database"
DATABASE_URL="postgresql://username:password@host:port/database"
```

### **4. Deploy Automático:**

**Arquivo `vercel.json` (já configurado):**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### **5. Variáveis de Ambiente no Vercel:**
```env
NODE_ENV=production
JWT_SECRET=sua_chave_super_secreta_diferente_da_dev
JWT_EXPIRES_IN=7d
POSTGRES_URL=postgresql://...
DATABASE_URL=postgresql://...
```

### **6. Scripts de Deploy:**
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "migrate:prod": "NODE_ENV=production npm run migrate:latest"
  }
}
```

---

## 🔧 **Comandos de Desenvolvimento:**

### **Local (SQLite):**
```bash
# Desenvolvimento
npm run dev

# Reset do banco local
rm src/database/database.db
npm run migrate:latest

# Ver dados no SQLite
npm install -g sqlite3
sqlite3 src/database/database.db ".tables"
```

### **Produção (Vercel):**
```bash
# Deploy
git push origin main  # Auto-deploy

# Migração em produção
vercel env pull .env.production
NODE_ENV=production npm run migrate:latest
```

---

## 📊 **Diferenças Técnicas Importantes:**

### **SQLite vs PostgreSQL:**

| Recurso | SQLite (Dev) | PostgreSQL (Prod) |
|---------|-------------|-------------------|
| UUID | String manual | UUID nativo |
| ENUM | String | ENUM real |
| Concurrent | Limitado | Ilimitado |
| Backup | Copiar arquivo | Dump SQL |
| Interface | Linha comando | pgAdmin/Vercel UI |

### **Migration Inteligente:**
O código detecta automaticamente qual banco usar:
```typescript
if (knex.client.config.client === "postgresql") {
  // Usar recursos PostgreSQL
  table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
} else {
  // Usar SQLite
  table.string("id", 36).primary();
}
```

---

## ✅ **Fluxo de Trabalho:**

### **1. Desenvolvimento:**
```bash
# Trabalhar local com SQLite
npm run dev
npm run migrate:latest  # SQLite
```

### **2. Teste de Produção:**
```bash
# Testar com PostgreSQL local (opcional)
NODE_ENV=production npm run dev
NODE_ENV=production npm run migrate:latest
```

### **3. Deploy:**
```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main  # Auto-deploy no Vercel
```

---

## 🎯 **Resumo da Estratégia:**

### **✅ AGORA (Desenvolvimento):**
- SQLite - funciona instantaneamente
- Foco no código, não no banco
- Testes rápidos

### **✅ DEPOIS (Deploy Vercel):**
- PostgreSQL - produção robusta
- Vercel cuida da infraestrutura
- Escalabilidade garantida

### **✅ FUTURO (Crescimento):**
- Mesmo código funciona
- Upgrade fácil para planos pagos
- Múltiplas regiões disponíveis

---

**Esta é a estratégia mais inteligente: simplicidade no desenvolvimento, robustez em produção!** 🚀

**Quer testar agora com SQLite e depois fazer deploy no Vercel?**
