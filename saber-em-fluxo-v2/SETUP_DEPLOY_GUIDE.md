# Guia de Configuração e Deploy - Saber em Fluxo

## 🚀 Setup Inicial do Projeto

### 1. Preparação do Ambiente

#### Backend Setup
```bash
cd backend
npm install
npm run build
```

#### Frontend Setup  
```bash
cd frontend
npm install
npm run build
```

### 2. Configuração do Banco de Dados

#### Desenvolvimento (SQLite)
```bash
cd backend
npm run migrate
npm run seed
```

#### Produção (PostgreSQL)
1. Configurar variáveis de ambiente
2. Executar migrações
3. Popular dados iniciais

### 3. Estrutura de Arquivos Essenciais

```
backend/
├── src/
│   ├── controllers/     # Controllers com lógica de negócio
│   ├── services/        # Camada de serviços
│   ├── routes/          # Definição de rotas API
│   ├── middlewares/     # Middlewares de autenticação
│   ├── database/        # Migrações e seeds
│   └── types/           # Definições TypeScript
├── knexfile.ts         # Configuração do banco
└── package.json        # Dependências

frontend/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/          # Páginas da aplicação
│   ├── services/       # Integração com API
│   ├── stores/         # Estado global (Zustand)
│   ├── contexts/       # Contextos React
│   └── types/          # Tipos compartilhados
├── tailwind.config.js  # Configuração Tailwind
└── vite.config.ts      # Configuração Vite
```

## 🗄️ Sistema de Banco de Dados

### Migrações Principais

1. **001_create_users_table** - Sistema de usuários básico
2. **002_enhance_users_auth** - Melhorias na autenticação
3. **003_create_courses_system** - Sistema de cursos completo
4. **004_create_gamification_system** - Sistema de gamificação
5. **005_create_chat_system** - Sistema de chat em tempo real

### Seeds de Dados

1. **001_achievements** - Conquistas do sistema de gamificação
2. **002_sample_courses** - Cursos de exemplo com módulos e aulas
3. **003_sample_chat_data** - Dados de exemplo para chat

## 🎮 Sistema de Gamificação

### Classes de Jogador
- **WARRIOR** - Foco em resistência e determinação
- **MAGE** - Especialista em conhecimento teórico
- **ARCHER** - Precisão e foco em objetivos

### Sistema de XP e Níveis
- XP por conclusão de aulas
- Bônus por classe de jogador
- Sistema de níveis progressivo
- Conquistas desbloqueáveis

### Conquistas Disponíveis
- **Aprendizado**: Primeiras aulas, cursos, séries de estudos
- **Streak**: Consistência de estudos diários/semanais
- **Especiais**: Marco de tempo, níveis alcançados

## 💬 Sistema de Chat

### Funcionalidades
- Canais públicos organizados por tópico
- Mensagens em tempo real com Socket.io
- Sistema híbrido (polling + websockets)
- Histórico persistente de mensagens

### Canais Padrão
- **Geral** - Discussões gerais da comunidade
- **React - Dúvidas** - Suporte específico para React
- **JavaScript - ES6+** - Discussões sobre JS moderno
- **Projetos** - Compartilhamento de projetos
- **Suporte** - Suporte técnico da plataforma

## 📚 Sistema de Cursos

### Estrutura Hierárquica
```
Curso
├── Módulos
│   ├── Aulas (vídeo, texto, quiz)
│   └── Ordem sequencial
├── Progresso do aluno
└── Sistema de matrícula
```

### Tipos de Conteúdo
- **Vídeo** - Aulas em vídeo com duração
- **Texto** - Conteúdo escrito/markdown
- **Quiz** - Avaliações interativas
- **Exercício** - Atividades práticas

## 🔐 Sistema de Autenticação

### Funcionalidades Implementadas
- Registro com verificação de email
- Login com JWT
- Recuperação de senha
- Middleware de autorização
- Sistema de roles (student/instructor/admin)

### Middleware de Segurança
- Validação de tokens JWT
- Rate limiting
- Validação de entrada
- Hash de senhas com bcrypt

## 🌐 APIs Implementadas

### Rotas de Autenticação (`/api/auth/`)
- `POST /register` - Cadastro de usuário
- `POST /login` - Login
- `POST /forgot-password` - Recuperação de senha
- `POST /reset-password` - Reset de senha
- `GET /me` - Dados do usuário atual

### Rotas de Cursos (`/api/courses/`)
- `GET /` - Listar cursos
- `GET /:id` - Detalhes do curso
- `POST /:id/enroll` - Matricular-se no curso
- `POST /:courseId/lessons/:lessonId/complete` - Marcar aula como concluída
- `GET /my-courses` - Cursos do usuário

### Rotas de Gamificação (`/api/game/`)
- `GET /profile` - Perfil do jogador
- `GET /achievements` - Conquistas disponíveis
- `GET /leaderboard` - Ranking de jogadores

### Rotas de Chat (`/api/chat/`)
- `GET /channels` - Listar canais
- `GET /channels/:id/messages` - Mensagens do canal
- `POST /channels/:id/messages` - Enviar mensagem

## 🚀 Deploy e Produção

### Variáveis de Ambiente

#### Backend (.env)
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
JWT_SECRET=seu_jwt_secret_super_seguro
JWT_REFRESH_SECRET=seu_refresh_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email
SMTP_PASS=sua_senha
FRONTEND_URL=https://seudominio.com
```

#### Frontend (.env)
```env
VITE_API_URL=https://api.seudominio.com
VITE_WS_URL=wss://api.seudominio.com
```

### Scripts Disponíveis

#### Backend
```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Build para produção
npm start            # Executar produção
npm run migrate      # Executar migrações
npm run seed         # Popular dados de exemplo
npm run rollback     # Reverter última migração
```

#### Frontend
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Verificar código
```

## 📊 Monitoramento e Logs

### Sistema de Logs
- Logs estruturados para debugging
- Rastreamento de erros
- Logs de performance
- Auditoria de operações críticas

### Métricas Importantes
- Taxa de conclusão de cursos
- Engagement do chat
- Progressão de XP dos usuários
- Performance das APIs

## 🔧 Troubleshooting

### Problemas Comuns

1. **Erro de Conexão com Banco**
   - Verificar DATABASE_URL
   - Confirmar se migrações foram executadas

2. **Problemas de CORS**
   - Configurar FRONTEND_URL corretamente
   - Verificar configuração do CORS no Express

3. **Falha na Autenticação**
   - Verificar JWT_SECRET
   - Confirmar se usuário está ativo

4. **Chat não funciona**
   - Verificar configuração Socket.io
   - Testar conectividade WebSocket

### Logs de Debug
```bash
# Backend
npm run dev -- --verbose

# Database debug
DEBUG=knex:query npm run dev
```

## 📈 Próximos Passos

### Melhorias Planejadas
1. **Notificações Push** - Sistema de notificações
2. **Mobile App** - Aplicativo React Native
3. **Analytics** - Dashboard de métricas
4. **Integração IA** - Assistente inteligente para estudos
5. **Sistema de Pagamentos** - Cursos premium

### Otimizações
- Cache Redis para performance
- CDN para assets estáticos
- Compressão de imagens
- Lazy loading de componentes

---

*Documentação atualizada em: Janeiro 2025*
*Versão do Sistema: 2.0 - Integração Completa*
