// FILE: /backend/src/database/seeds/004_course_resources.ts
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Limpar dados existentes de recursos (se a tabela existir)
  try {
    await knex('course_resources').del();
  } catch (error) {
    console.log('Tabela course_resources não existe ainda, criando recursos como parte do conteúdo das aulas');
  }

  // Vamos adicionar mais aulas com diferentes tipos de conteúdo para tornar os cursos mais ricos
  
  // Encontrar cursos existentes
  const reactCourse = await knex('courses').where('title', 'React do Zero ao Profissional').first();
  const jsCourse = await knex('courses').where('title', 'JavaScript Moderno - ES6+').first();
  const pythonCourse = await knex('courses').where('title', 'Python para Data Science').first();
  const nodeJsCourse = await knex('courses').where('title', 'Node.js e APIs REST').first();
  
  if (!reactCourse || !jsCourse || !pythonCourse || !nodeJsCourse) {
    console.log('❌ Cursos não encontrados. Execute o seed 002_sample_courses primeiro.');
    return;
  }

  // Adicionar módulos e aulas para Node.js
  const nodeModules = await knex('course_modules').insert([
    {
      course_id: nodeJsCourse.id,
      title: 'Fundamentos do Node.js',
      description: 'Runtime JavaScript, NPM e módulos essenciais',
      order_index: 1
    },
    {
      course_id: nodeJsCourse.id,
      title: 'Express.js Framework',
      description: 'Criando servidores web e APIs REST',
      order_index: 2
    },
    {
      course_id: nodeJsCourse.id,
      title: 'Banco de Dados',
      description: 'MongoDB, Mongoose, SQL e ORMs',
      order_index: 3
    },
    {
      course_id: nodeJsCourse.id,
      title: 'Autenticação e Segurança',
      description: 'JWT, middleware de autenticação e boas práticas',
      order_index: 4
    },
    {
      course_id: nodeJsCourse.id,
      title: 'Deploy e Produção',
      description: 'Heroku, AWS, PM2 e monitoramento',
      order_index: 5
    }
  ]).returning('*');

  // Aulas para o módulo de Express.js
  const expressModule = nodeModules.find(m => m.title === 'Express.js Framework');
  if (expressModule) {
    await knex('lessons').insert([
      {
        module_id: expressModule.id,
        title: 'Criando seu Primeiro Servidor',
        description: 'Setup do Express e rotas básicas',
        type: 'video',
        content: `# Criando seu Primeiro Servidor Express

## Instalação e Setup

### Inicializar Projeto
\`\`\`bash
mkdir minha-api
cd minha-api
npm init -y

# Instalar dependências
npm install express
npm install -D nodemon
\`\`\`

### Estrutura Inicial
\`\`\`javascript
// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsing JSON
app.use(express.json());

// Rota básica
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à minha API!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(\`🚀 Servidor rodando na porta \${PORT}\`);
});
\`\`\`

### Script no package.json
\`\`\`json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
\`\`\`

## Rotas HTTP

### GET - Buscar Dados
\`\`\`javascript
// Lista de usuários
app.get('/users', (req, res) => {
  const users = [
    { id: 1, name: 'João', email: 'joao@email.com' },
    { id: 2, name: 'Maria', email: 'maria@email.com' }
  ];
  res.json(users);
});

// Usuário específico
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const user = users.find(u => u.id === parseInt(id));
  
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  
  res.json(user);
});

// Query parameters
app.get('/search', (req, res) => {
  const { q, limit = 10 } = req.query;
  res.json({
    query: q,
    limit: parseInt(limit),
    results: []
  });
});
\`\`\`

### POST - Criar Dados
\`\`\`javascript
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  
  // Validação básica
  if (!name || !email) {
    return res.status(400).json({
      error: 'Nome e email são obrigatórios'
    });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email,
    createdAt: new Date()
  };
  
  users.push(newUser);
  
  res.status(201).json({
    message: 'Usuário criado com sucesso',
    user: newUser
  });
});
\`\`\`

### PUT - Atualizar Dados
\`\`\`javascript
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  
  const userIndex = users.findIndex(u => u.id === parseInt(id));
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  
  users[userIndex] = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    email: email || users[userIndex].email,
    updatedAt: new Date()
  };
  
  res.json({
    message: 'Usuário atualizado',
    user: users[userIndex]
  });
});
\`\`\`

### DELETE - Remover Dados
\`\`\`javascript
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex(u => u.id === parseInt(id));
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  
  res.json({
    message: 'Usuário removido',
    user: deletedUser
  });
});
\`\`\`

## Testando a API

### Com curl
\`\`\`bash
# GET
curl http://localhost:3000/users

# POST
curl -X POST http://localhost:3000/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Pedro","email":"pedro@email.com"}'

# PUT
curl -X PUT http://localhost:3000/users/1 \\
  -H "Content-Type: application/json" \\
  -d '{"name":"João Silva"}'

# DELETE
curl -X DELETE http://localhost:3000/users/1
\`\`\`

### Com Postman/Insomnia
1. Criar nova requisição
2. Definir método HTTP
3. Inserir URL
4. Adicionar headers se necessário
5. Adicionar body para POST/PUT
6. Enviar e verificar resposta

Parabéns! Você criou sua primeira API RESTful! 🎉`,
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration_minutes: 35,
        xp_reward: 50,
        order_index: 1,
        is_free: true
      },
      {
        module_id: expressModule.id,
        title: 'Middlewares e Tratamento de Erros',
        description: 'Interceptadores, validação e error handling',
        type: 'video',
        content: `# Middlewares e Tratamento de Erros

## O que são Middlewares?

Middlewares são funções que têm acesso ao objeto de requisição (\`req\`), resposta (\`res\`) e à próxima função middleware (\`next\`).

### Estrutura de um Middleware
\`\`\`javascript
function meuMiddleware(req, res, next) {
  // Lógica do middleware
  console.log('Middleware executado');
  
  // Passar para o próximo middleware
  next();
}

// Usar globalmente
app.use(meuMiddleware);

// Usar em rota específica
app.get('/protected', meuMiddleware, (req, res) => {
  res.json({ message: 'Rota protegida' });
});
\`\`\`

## Middlewares Comuns

### Logger Customizado
\`\`\`javascript
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(\`[\${timestamp}] \${req.method} \${req.url}\`);
  next();
};

app.use(logger);
\`\`\`

### Validação de Token
\`\`\`javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token necessário' });
  }
  
  // Verificar token (simulado)
  if (token !== 'valid-token') {
    return res.status(403).json({ error: 'Token inválido' });
  }
  
  req.user = { id: 1, name: 'João' }; // Dados do usuário
  next();
};

// Proteger rotas
app.get('/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});
\`\`\`

### Validação de Dados
\`\`\`javascript
const validateUser = (req, res, next) => {
  const { name, email } = req.body;
  const errors = [];
  
  if (!name || name.trim().length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  }
  
  if (!email || !email.includes('@')) {
    errors.push('Email inválido');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  next();
};

app.post('/users', validateUser, (req, res) => {
  // Criar usuário (dados já validados)
});
\`\`\`

### Rate Limiting
\`\`\`javascript
const rateLimit = {};

const rateLimiter = (limit = 100, window = 3600000) => {
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    
    if (!rateLimit[ip]) {
      rateLimit[ip] = { count: 1, resetTime: now + window };
      return next();
    }
    
    if (now > rateLimit[ip].resetTime) {
      rateLimit[ip] = { count: 1, resetTime: now + window };
      return next();
    }
    
    if (rateLimit[ip].count >= limit) {
      return res.status(429).json({
        error: 'Muitas requisições. Tente novamente mais tarde.'
      });
    }
    
    rateLimit[ip].count++;
    next();
  };
};

app.use(rateLimiter(100, 3600000)); // 100 req/hora
\`\`\`

## Tratamento de Erros

### Error Handler Global
\`\`\`javascript
// Middleware de erro (sempre por último)
const errorHandler = (err, req, res, next) => {
  console.error('Erro:', err);
  
  // Erro de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: err.message
    });
  }
  
  // Erro de não encontrado
  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      error: 'Recurso não encontrado'
    });
  }
  
  // Erro genérico
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'production' 
      ? 'Algo deu errado' 
      : err.message
  });
};

app.use(errorHandler);
\`\`\`

### Try-Catch Wrapper
\`\`\`javascript
// Wrapper para async/await
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Uso
app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    const error = new Error('Usuário não encontrado');
    error.name = 'NotFoundError';
    throw error;
  }
  
  res.json(user);
}));
\`\`\`

### Middleware de 404
\`\`\`javascript
// Deve vir antes do error handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method
  });
});
\`\`\`

## Exemplo Completo

\`\`\`javascript
const express = require('express');
const app = express();

// Middlewares globais
app.use(express.json());
app.use(logger);
app.use(rateLimiter());

// Rotas
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

app.post('/users', validateUser, (req, res) => {
  // Criar usuário
});

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler
app.use(errorHandler);

app.listen(3000, () => {
  console.log('🚀 Servidor rodando na porta 3000');
});
\`\`\`

Middlewares tornam sua API mais robusta e segura! 🛡️`,
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration_minutes: 42,
        xp_reward: 60,
        order_index: 2
      },
      {
        module_id: expressModule.id,
        title: 'Documentação da API com Swagger',
        description: 'Documentando endpoints com OpenAPI/Swagger',
        type: 'text',
        content: `# Documentação da API com Swagger

## Por que Documentar?

- **Facilita integração** entre equipes
- **Reduz tempo de debugging**
- **Melhora experiência do desenvolvedor**
- **Serve como contrato da API**

## Instalação

\`\`\`bash
npm install swagger-ui-express swagger-jsdoc
\`\`\`

## Configuração Básica

\`\`\`javascript
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Minha API',
      version: '1.0.0',
      description: 'API para gerenciamento de usuários',
      contact: {
        name: 'Suporte API',
        email: 'suporte@minhaapi.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento'
      },
      {
        url: 'https://api.meusite.com',
        description: 'Servidor de produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Caminhos para os arquivos com anotações
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
\`\`\`

## Documentando Modelos

\`\`\`javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único do usuário
 *           example: 1
 *         name:
 *           type: string
 *           description: Nome completo do usuário
 *           example: João Silva
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *           example: joao@email.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *           example: 2023-01-15T10:30:00Z
 *     
 *     UserInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         email:
 *           type: string
 *           format: email
 *     
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensagem de erro
 *         details:
 *           type: string
 *           description: Detalhes adicionais
 */
\`\`\`

## Documentando Rotas

### GET - Listar Usuários
\`\`\`javascript
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     description: Retorna uma lista paginada de usuários do sistema
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Quantidade de itens por página
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/users', getUsersController);
\`\`\`

### POST - Criar Usuário
\`\`\`javascript
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     description: Adiciona um novo usuário ao sistema
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *           examples:
 *             user1:
 *               summary: Usuário exemplo
 *               value:
 *                 name: Maria Santos
 *                 email: maria@email.com
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário criado com sucesso
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token necessário
 *       403:
 *         description: Token inválido
 */
app.post('/users', createUserController);
\`\`\`

### GET - Buscar Usuário por ID
\`\`\`javascript
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Busca usuário por ID
 *     description: Retorna um usuário específico pelo seu ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: Usuário não encontrado
 */
app.get('/users/:id', getUserByIdController);
\`\`\`

## Grupos e Tags

\`\`\`javascript
/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Operações relacionadas a usuários
 *   - name: Auth
 *     description: Autenticação e autorização
 *   - name: Products
 *     description: Gerenciamento de produtos
 */
\`\`\`

## Exemplos e Cenários

\`\`\`javascript
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags:
 *       - Auth
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *           examples:
 *             admin:
 *               summary: Login de administrador
 *               value:
 *                 email: admin@email.com
 *                 password: admin123
 *             user:
 *               summary: Login de usuário comum
 *               value:
 *                 email: user@email.com
 *                 password: user123
 */
\`\`\`

## Acesso à Documentação

Após configurar, acesse: \`http://localhost:3000/api-docs\`

### Recursos da Interface:
- **Try it out**: Testar endpoints direto na documentação
- **Models**: Ver estrutura dos dados
- **Authorize**: Configurar tokens de autenticação
- **Export**: Baixar especificação OpenAPI

Uma API bem documentada é uma API bem utilizada! 📚✨`,
        duration_minutes: 25,
        xp_reward: 45,
        order_index: 3
      }
    ]);
  }

  console.log('✅ Recursos adicionais criados com sucesso!');
}
