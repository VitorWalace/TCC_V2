# 🎓 Saber em Fluxo v2.0

Uma plataforma educacional gamificada moderna, desenvolvida com React, TypeScript e Node.js.

## 📋 Descrição do Projeto

O **Saber em Fluxo** é uma plataforma de ensino online que combina educação e gamificação para criar uma experiência de aprendizado envolvente. A plataforma oferece cursos completos, sistema de XP e níveis, chat integrado e interface moderna.

### 🚀 Funcionalidades Principais

- **Sistema de Autenticação**: Login/registro com JWT
- **Catálogo de Cursos**: 12 cursos completos com 570+ horas de conteúdo
- **Gamificação**: Sistema de XP, níveis e conquistas
- **Chat em Tempo Real**: Comunicação entre usuários
- **Perfil Personalizável**: Biografia, avatar e configurações
- **Conteúdo Rico**: Vídeos, textos, exercícios e quizzes
- **Interface Responsiva**: Design moderno com Tailwind CSS

### 📚 Cursos Disponíveis

1. **React Desenvolvimento Web** (8 módulos, 80h)
2. **JavaScript ES6+** (4 módulos, 40h) 
3. **Python Data Science** (5 módulos, 60h)
4. **Node.js & APIs** (5 módulos, 50h)
5. **Machine Learning Básico** (4 módulos, 45h)
6. **Vue.js Framework** (5 módulos, 55h)
7. **TypeScript Avançado** (4 módulos, 40h)
8. **React Native** (6 módulos, 60h)
9. **Docker & DevOps** (4 módulos, 35h)
10. **AWS Cloud Computing** (5 módulos, 50h)
11. **Cybersecurity Fundamentos** (4 módulos, 30h)
12. **Introdução à Programação** (3 módulos, 25h)

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18.2.0** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Zustand** para gerenciamento de estado
- **React Router DOM** para navegação
- **Axios** para requisições HTTP
- **React Hot Toast** para notificações

### Backend
- **Node.js** com TypeScript
- **Express.js** framework web
- **SQLite** banco de dados
- **Knex.js** query builder
- **JWT** autenticação
- **Socket.IO** chat em tempo real
- **Helmet** segurança
- **CORS** configuração de origem cruzada

## 📁 Estrutura do Projeto

```
saber-em-fluxo-v2/
├── frontend/                 # Aplicação React
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços de API
│   │   ├── stores/         # Gerenciamento de estado
│   │   ├── contexts/       # Contextos React
│   │   └── types/          # Definições TypeScript
│   └── package.json
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── controllers/    # Controladores
│   │   ├── routes/         # Rotas da API
│   │   ├── services/       # Lógica de negócio
│   │   ├── middlewares/    # Middlewares
│   │   ├── database/       # Configuração do banco
│   │   └── types/          # Definições TypeScript
│   └── package.json
└── README.md
```

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (v16 ou superior)
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/saber-em-fluxo-v2.git
cd saber-em-fluxo-v2
```

### 2. Configure o Backend
```bash
cd backend
npm install
cp .env.example .env  # Configure suas variáveis de ambiente
npm run migrate       # Execute as migrações
npm run seed         # Popule o banco com dados
npm run dev          # Inicie o servidor de desenvolvimento
```

### 3. Configure o Frontend  
```bash
cd frontend
npm install
npm run dev          # Inicie o servidor de desenvolvimento
```

### 4. Acesse a aplicação
- Frontend: http://localhost:5191
- Backend: http://localhost:4003
- API Docs: http://localhost:4003/api/health

## 🔧 Configuração

### Variáveis de Ambiente (Backend)

Crie um arquivo `.env` na pasta `backend/` com:

```env
# Server Configuration
PORT=4003
HOST=localhost
NODE_ENV=development

# Database
DATABASE_PATH=./src/database/database.db

# JWT
JWT_SECRET=sua-chave-secreta-aqui
JWT_EXPIRES_IN=7d

# Socket.IO
SOCKET_CORS_ORIGIN=http://localhost:5191
```

### Variáveis de Ambiente (Frontend)

Crie um arquivo `.env` na pasta `frontend/` com:

```env
VITE_API_URL=http://localhost:4003/api
VITE_SOCKET_URL=http://localhost:4003
VITE_APP_NAME=Saber em Fluxo
VITE_APP_VERSION=2.0.0
```

## 🎮 Sistema de Gamificação

- **XP (Experiência)**: Ganhe pontos completando lições
- **Níveis**: Progrida através de diferentes níveis
- **Conquistas**: Desbloqueie marcos especiais
- **Ranking**: Compare seu progresso com outros usuários

## 💬 Chat em Tempo Real

Sistema de chat integrado usando Socket.IO para comunicação instantânea entre usuários da plataforma.

## 🔒 Segurança

- Autenticação JWT
- Senhas hasheadas
- Rate limiting
- Validação de dados
- Sanitização de entrada
- Headers de segurança

## 📊 Status do Projeto

- ✅ Sistema de autenticação implementado
- ✅ Catálogo completo de cursos (12 cursos, 570h)
- ✅ Sistema de gamificação funcionando
- ✅ Chat em tempo real implementado
- ✅ Interface responsiva e moderna
- ✅ Backend API completa
- ✅ Banco de dados configurado

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Seu Nome** - Desenvolvedor Principal

## 🙏 Agradecimentos

- Instituição Adventista de Ensino
- Comunidade Open Source
- Contribuidores do projeto

---

**Desenvolvido com ❤️ para educação gamificada**
