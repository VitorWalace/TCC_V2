# 🧪 Manual de Testes - Sistema de Autenticação

## 📋 Pré-requisitos

1. **XAMPP rodando** (Apache + MySQL)
2. **Base de dados criada**: `saber_em_fluxo_v2`
3. **Servidor backend rodando**: `npm run dev`

## 🗄️ PASSO 1: Executar Migrações

**Abra um novo terminal/cmd e execute:**

```bash
# Navegar para o backend
cd "c:\Users\Pichau\OneDrive - Instituição Adventista de Ensino\Documentos\TCC_V2\saber-em-fluxo-v2\backend"

# Executar migração
npm run migrate:latest
```

**Resultado esperado:**
- Tabela `users` criada no phpMyAdmin
- Mensagem de sucesso da migração

## 🏥 PASSO 2: Teste Health Check

**Abra o navegador e acesse:**
```
http://localhost:5000/api/health
```

**Resultado esperado:**
```json
{
  "success": true,
  "message": "Saber em Fluxo API v2.0 está funcionando!",
  "timestamp": "2025-08-15T...",
  "environment": "development"
}
```

## 📱 PASSO 3: Testar com Postman/Insomnia

### 🔐 **3.1 - Registro de Usuário**

**Método:** POST  
**URL:** `http://localhost:5000/api/auth/register`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "teste@exemplo.com",
  "password": "MinhaSenh@123",
  "first_name": "João",
  "last_name": "Silva"
}
```

**Resultado esperado:**
- Status: 201 Created
- JSON com user + token

### 🔑 **3.2 - Login**

**Método:** POST  
**URL:** `http://localhost:5000/api/auth/login`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "teste@exemplo.com",
  "password": "MinhaSenh@123"
}
```

**Resultado esperado:**
- Status: 200 OK
- JSON com user + token

### 👤 **3.3 - Obter Perfil (Autenticado)**

**Método:** GET  
**URL:** `http://localhost:5000/api/auth/profile`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resultado esperado:**
- Status: 200 OK
- JSON com dados do perfil

### ✏️ **3.4 - Atualizar Perfil**

**Método:** PUT  
**URL:** `http://localhost:5000/api/auth/profile`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_AQUI
```

**Body (JSON):**
```json
{
  "first_name": "João Carlos",
  "bio": "Desenvolvedor apaixonado por educação"
}
```

### 🔒 **3.5 - Alterar Senha**

**Método:** PUT  
**URL:** `http://localhost:5000/api/auth/change-password`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_AQUI
```

**Body (JSON):**
```json
{
  "current_password": "MinhaSenh@123",
  "new_password": "NovaSenha@456",
  "confirm_password": "NovaSenha@456"
}
```

## 📊 PASSO 4: Verificar no Banco de Dados

**Acesse phpMyAdmin:**
1. http://localhost/phpmyadmin
2. Selecione `saber_em_fluxo_v2`
3. Clique na tabela `users`
4. Verifique se o usuário foi criado
5. Confirme que a senha está hasheada (bcrypt)

## 🐛 Resolução de Problemas

### **Erro: "connect ECONNREFUSED"**
- Verifique se o MySQL está rodando no XAMPP
- Confirme se a porta 3306 está livre

### **Erro: "ER_BAD_DB_ERROR"**
- Certifique-se de que criou a base de dados `saber_em_fluxo_v2`
- Verifique o arquivo `.env`

### **Erro: "Table doesn't exist"**
- Execute `npm run migrate:latest`
- Verifique se a migração foi executada com sucesso

### **Token inválido**
- Verifique se está enviando o header `Authorization: Bearer TOKEN`
- Confirme se o token não expirou

## ✅ Checklist de Validação

- [ ] Health check retorna 200
- [ ] Registro cria usuário no banco
- [ ] Login retorna token válido
- [ ] Perfil retorna dados com token
- [ ] Atualização de perfil funciona
- [ ] Alteração de senha funciona
- [ ] Senha está hasheada no banco
- [ ] Endpoints protegidos rejeitam requisições sem token

## 🎯 Próximos Passos

Após validar a autenticação:
1. **Frontend React** - Criar interfaces
2. **Sistema de Cursos** - CRUD de cursos
3. **Chat em Tempo Real** - Socket.IO
4. **Dashboard Admin** - Gestão

---

**Status:** ✅ Sistema de autenticação implementado e pronto para testes!
