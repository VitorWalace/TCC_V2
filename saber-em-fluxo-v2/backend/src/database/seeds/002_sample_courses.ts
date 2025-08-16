// FILE: /backend/src/database/seeds/002_sample_courses.ts
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Buscar ou criar usuário instrutor padrão
  let instructor = await knex('users').where('email', 'instructor@saberemfluxo.com').first();
  
  if (!instructor) {
    [instructor] = await knex('users').insert({
      email: 'instructor@saberemfluxo.com',
      first_name: 'João',
      last_name: 'Professor',
      password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      role: 'instructor',
      is_email_verified: true,
      is_active: true,
      player_class: 'MAGE',
      level: 50,
      xp_points: 25000
    }).returning('*');
  }

  // Deletar dados existentes
  await knex('lesson_progress').del();
  await knex('enrollments').del();
  await knex('lessons').del();
  await knex('course_modules').del();
  await knex('courses').del();

  // Criar cursos de exemplo
  const courses = await knex('courses').insert([
    {
      title: 'React do Zero ao Profissional',
      description: 'Aprenda React.js com projetos práticos e gamificação. Do básico ao avançado com Hooks, Context API e desenvolvimento de SPAs.',
      category: 'Desenvolvimento Web',
      difficulty: 'Intermediário',
      cover_image_url: '/images/courses/react-course.jpg',
      estimated_hours: 40,
      xp_reward: 1000,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    },
    {
      title: 'JavaScript Moderno - ES6+',
      description: 'Domine as funcionalidades modernas do JavaScript: Arrow Functions, Destructuring, Async/Await, Modules e muito mais.',
      category: 'Desenvolvimento Web',
      difficulty: 'Intermediário',
      cover_image_url: '/images/courses/js-modern.jpg',
      estimated_hours: 30,
      xp_reward: 800,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    },
    {
      title: 'Python para Data Science',
      description: 'Análise completa de dados com Python: Pandas, NumPy, Matplotlib, Seaborn e introdução ao Machine Learning com Scikit-learn.',
      category: 'Data Science',
      difficulty: 'Avançado',
      cover_image_url: '/images/courses/python-data.jpg',
      estimated_hours: 60,
      xp_reward: 1500,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    },
    {
      title: 'Introdução à Programação',
      description: 'Seus primeiros passos no mundo da programação. Lógica, algoritmos, estruturas de dados e resolução de problemas.',
      category: 'Programação',
      difficulty: 'Iniciante',
      cover_image_url: '/images/courses/intro-programming.jpg',
      estimated_hours: 25,
      xp_reward: 600,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    },
    {
      title: 'Node.js e APIs REST',
      description: 'Desenvolva APIs robustas e escaláveis com Node.js, Express, autenticação JWT e bancos de dados SQL/NoSQL.',
      category: 'Desenvolvimento Web',
      difficulty: 'Avançado',
      cover_image_url: '/images/courses/nodejs-api.jpg',
      estimated_hours: 45,
      xp_reward: 1200,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    },
    {
      title: 'Machine Learning com Python',
      description: 'Aprendizado de máquina do zero: algoritmos supervisionados, não-supervisionados, deep learning com TensorFlow e Keras.',
      category: 'Inteligência Artificial',
      difficulty: 'Avançado',
      cover_image_url: '/images/courses/ml-python.jpg',
      estimated_hours: 80,
      xp_reward: 2000,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    },
    {
      title: 'Docker e DevOps Essencial',
      description: 'Containerização com Docker, orquestração com Docker Compose, CI/CD e deploy automatizado na nuvem.',
      category: 'DevOps',
      difficulty: 'Intermediário',
      cover_image_url: '/images/courses/docker-devops.jpg',
      estimated_hours: 35,
      xp_reward: 900,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    },
    {
      title: 'Vue.js 3 Completo',
      description: 'Framework Vue.js 3 com Composition API, Pinia para gerenciamento de estado e desenvolvimento de aplicações modernas.',
      category: 'Desenvolvimento Web',
      difficulty: 'Intermediário',
      cover_image_url: '/images/courses/vue-complete.jpg',
      estimated_hours: 38,
      xp_reward: 950,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    },
    {
      title: 'TypeScript para Desenvolvedores',
      description: 'TypeScript avançado: tipos, interfaces, generics, decorators e integração com React, Node.js e frameworks modernos.',
      category: 'Desenvolvimento Web',
      difficulty: 'Intermediário',
      cover_image_url: '/images/courses/typescript-dev.jpg',
      estimated_hours: 32,
      xp_reward: 850,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    },
    {
      title: 'Desenvolvimento Mobile com React Native',
      description: 'Crie apps nativas para iOS e Android com React Native, navegação, APIs, push notifications e deploy nas stores.',
      category: 'Desenvolvimento Mobile',
      difficulty: 'Avançado',
      cover_image_url: '/images/courses/react-native.jpg',
      estimated_hours: 55,
      xp_reward: 1400,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    },
    {
      title: 'Cybersecurity Fundamentals',
      description: 'Fundamentos de segurança cibernética: criptografia, redes seguras, testes de penetração e proteção de dados.',
      category: 'Segurança',
      difficulty: 'Intermediário',
      cover_image_url: '/images/courses/cybersecurity.jpg',
      estimated_hours: 42,
      xp_reward: 1100,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    },
    {
      title: 'AWS Cloud Practitioner',
      description: 'Amazon Web Services do básico ao avançado: EC2, S3, RDS, Lambda, CloudFormation e arquiteturas na nuvem.',
      category: 'Cloud Computing',
      difficulty: 'Intermediário',
      cover_image_url: '/images/courses/aws-cloud.jpg',
      estimated_hours: 50,
      xp_reward: 1300,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    }
  ]).returning('*');

  // Criar módulos e aulas para o curso de React
  const reactCourse = courses.find(c => c.title === 'React do Zero ao Profissional');
  if (reactCourse) {
    const modules = await knex('course_modules').insert([
      {
        course_id: reactCourse.id,
        title: 'Fundamentos do React',
        description: 'Conceitos básicos, JSX, componentes e estrutura do React',
        order_index: 1
      },
      {
        course_id: reactCourse.id,
        title: 'Componentes e Props',
        description: 'Criando e utilizando componentes reutilizáveis, passagem de dados',
        order_index: 2
      },
      {
        course_id: reactCourse.id,
        title: 'Estado e Hooks',
        description: 'useState, useEffect, useContext e hooks customizados',
        order_index: 3
      },
      {
        course_id: reactCourse.id,
        title: 'Formulários e Eventos',
        description: 'Manipulação de formulários, validação e eventos do usuário',
        order_index: 4
      },
      {
        course_id: reactCourse.id,
        title: 'Roteamento com React Router',
        description: 'Navegação SPA, rotas dinâmicas e guardas de rota',
        order_index: 5
      },
      {
        course_id: reactCourse.id,
        title: 'Gerenciamento de Estado Global',
        description: 'Context API, Zustand e padrões avançados de estado',
        order_index: 6
      },
      {
        course_id: reactCourse.id,
        title: 'Integração com APIs',
        description: 'Requisições HTTP, Axios, tratamento de erros e loading states',
        order_index: 7
      },
      {
        course_id: reactCourse.id,
        title: 'Projeto Final - E-commerce',
        description: 'Construindo uma aplicação completa de e-commerce',
        order_index: 8
      }
    ]).returning('*');

    // Módulo 1: Fundamentos do React
    const fundamentosModule = modules.find(m => m.title === 'Fundamentos do React');
    if (fundamentosModule) {
      await knex('lessons').insert([
        {
          module_id: fundamentosModule.id,
          title: 'Introdução ao React',
          description: 'História, filosofia e por que usar React',
          type: 'video',
          content: `# Introdução ao React

## O que é React?

React é uma biblioteca JavaScript para construir interfaces de usuário, mantida pelo Facebook. Foi criada em 2013 por Jordan Walke e revolucionou o desenvolvimento web.

### Por que React é importante?

1. **Componentização**: Divide a UI em componentes reutilizáveis
2. **Virtual DOM**: Performance otimizada
3. **Declarativo**: Descreva como a UI deve parecer
4. **Unidirecional**: Fluxo de dados previsível
5. **Ecossistema Rico**: Milhares de bibliotecas

### Principais Conceitos

- **JSX**: Sintaxe que permite escrever HTML no JavaScript
- **Componentes**: Blocos reutilizáveis de código
- **Props**: Propriedades passadas para componentes
- **State**: Estado interno dos componentes

### Empresas que usam React

- Facebook/Meta
- Netflix
- Uber
- Airbnb
- Instagram
- WhatsApp Web

React não é apenas uma tecnologia, é uma filosofia de desenvolvimento que prioriza a experiência do desenvolvedor e a performance da aplicação.`,
          video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration_minutes: 18,
          xp_reward: 25,
          order_index: 1,
          is_free: true
        },
        {
          module_id: fundamentosModule.id,
          title: 'Setup do Ambiente de Desenvolvimento',
          description: 'Node.js, npm, Create React App e VS Code',
          type: 'video',
          content: `# Setup do Ambiente React

## Pré-requisitos

### 1. Node.js
- Baixe em: https://nodejs.org
- Versão recomendada: 16.x ou superior
- Inclui npm (Node Package Manager)

### 2. Editor de Código
- **VS Code**: Editor recomendado
- **Extensões úteis**:
  - ES7+ React/Redux/React-Native snippets
  - Bracket Pair Colorizer
  - Auto Rename Tag
  - Prettier

## Criando seu primeiro projeto

\`\`\`bash
# Instalar Create React App globalmente
npm install -g create-react-app

# Criar novo projeto
npx create-react-app meu-app

# Entrar no diretório
cd meu-app

# Iniciar servidor de desenvolvimento
npm start
\`\`\`

## Estrutura do Projeto

\`\`\`
meu-app/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
\`\`\`

### Arquivos Importantes

- **public/index.html**: Template HTML principal
- **src/index.js**: Ponto de entrada da aplicação
- **src/App.js**: Componente principal
- **package.json**: Dependências e scripts

## Scripts Disponíveis

- \`npm start\`: Inicia o servidor de desenvolvimento
- \`npm build\`: Cria versão otimizada para produção
- \`npm test\`: Executa testes
- \`npm eject\`: Remove abstrações (irreversível!)`,
          video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration_minutes: 22,
          xp_reward: 30,
          order_index: 2,
          is_free: true
        },
        {
          module_id: fundamentosModule.id,
          title: 'JSX - JavaScript XML',
          description: 'Sintaxe JSX, expressões, elementos e componentes',
          type: 'video',
          content: `# JSX - JavaScript XML

## O que é JSX?

JSX é uma extensão de sintaxe para JavaScript que permite escrever elementos HTML dentro do código JavaScript de forma declarativa.

## Sintaxe Básica

\`\`\`jsx
// JSX simples
const element = <h1>Olá, Mundo!</h1>;

// JSX com expressões
const name = 'João';
const element = <h1>Olá, {name}!</h1>;

// JSX com múltiplos elementos
const element = (
  <div>
    <h1>Título</h1>
    <p>Parágrafo</p>
  </div>
);
\`\`\`

## Regras do JSX

### 1. Elementos devem ter uma tag de fechamento
\`\`\`jsx
// ✅ Correto
<input />
<br />

// ❌ Incorreto
<input>
<br>
\`\`\`

### 2. Atributos usam camelCase
\`\`\`jsx
// ✅ Correto
<div className="container">
<label htmlFor="input">

// ❌ Incorreto  
<div class="container">
<label for="input">
\`\`\`

### 3. Um elemento pai é obrigatório
\`\`\`jsx
// ✅ Correto
return (
  <div>
    <h1>Título</h1>
    <p>Parágrafo</p>
  </div>
);

// ✅ Ou usar Fragment
return (
  <>
    <h1>Título</h1>
    <p>Parágrafo</p>
  </>
);
\`\`\`

## Expressões JavaScript

\`\`\`jsx
const App = () => {
  const user = {
    name: 'Maria',
    age: 25
  };
  
  const isLoggedIn = true;
  
  return (
    <div>
      <h1>Bem-vinda, {user.name}!</h1>
      <p>Você tem {user.age} anos</p>
      
      {isLoggedIn ? (
        <button>Logout</button>
      ) : (
        <button>Login</button>
      )}
      
      {user.age >= 18 && <p>Você é maior de idade</p>}
    </div>
  );
};
\`\`\`

## Renderização de Listas

\`\`\`jsx
const TodoList = () => {
  const todos = [
    { id: 1, text: 'Estudar React' },
    { id: 2, text: 'Fazer exercícios' },
    { id: 3, text: 'Construir projeto' }
  ];
  
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
};
\`\`\`

## Estilos em JSX

\`\`\`jsx
// CSS Classes
<div className="header primary">

// Estilos inline
<div style={{
  backgroundColor: 'blue',
  color: 'white',
  padding: '10px'
}}>

// Estilos condicionais
<div className={isActive ? 'active' : 'inactive'}>
\`\`\`

JSX torna o código mais legível e permite misturar lógica com apresentação de forma elegante!`,
          video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration_minutes: 28,
          xp_reward: 35,
          order_index: 3
        },
        {
          module_id: fundamentosModule.id,
          title: 'Seu Primeiro Componente',
          description: 'Criando e utilizando componentes funcionais',
          type: 'text',
          content: `# Seu Primeiro Componente React

## Componentes Funcionais

Componentes são a base do React. Eles são funções JavaScript que retornam JSX.

\`\`\`jsx
// Componente simples
function Welcome() {
  return <h1>Bem-vindo ao React!</h1>;
}

// Ou com arrow function
const Welcome = () => {
  return <h1>Bem-vindo ao React!</h1>;
};

// Ou mais conciso
const Welcome = () => <h1>Bem-vindo ao React!</h1>;
\`\`\`

## Usando o Componente

\`\`\`jsx
import React from 'react';
import Welcome from './Welcome';

function App() {
  return (
    <div>
      <Welcome />
      <Welcome />
      <Welcome />
    </div>
  );
}

export default App;
\`\`\`

## Exercício Prático

Crie um componente \`Profile\` que exibe informações de um usuário:

\`\`\`jsx
const Profile = () => {
  const user = {
    name: 'Ana Silva',
    profession: 'Desenvolvedora',
    location: 'São Paulo, SP',
    avatar: 'https://via.placeholder.com/100'
  };

  return (
    <div className="profile">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.profession}</p>
      <p>{user.location}</p>
    </div>
  );
};
\`\`\`

## Boas Práticas

1. **Nome com PascalCase**: \`MyComponent\`
2. **Um componente por arquivo**
3. **Export default** no final do arquivo
4. **Imports organizados** no topo

Parabéns! Você criou seus primeiros componentes React! 🎉`,
          duration_minutes: 15,
          xp_reward: 40,
          order_index: 4
        },
        {
          module_id: fundamentosModule.id,
          title: 'Quiz: Fundamentos do React',
          description: 'Teste seus conhecimentos sobre os fundamentos',
          type: 'quiz',
          content: JSON.stringify({
            questions: [
              {
                question: 'O que é JSX?',
                options: [
                  'Uma linguagem de programação',
                  'Uma extensão de sintaxe para JavaScript que permite escrever HTML',
                  'Um framework CSS',
                  'Um banco de dados'
                ],
                correctAnswer: 1,
                explanation: 'JSX é uma extensão de sintaxe para JavaScript que permite escrever elementos HTML de forma declarativa.'
              },
              {
                question: 'React é uma...',
                options: [
                  'Linguagem de programação',
                  'Biblioteca JavaScript para construir interfaces',
                  'Framework PHP',
                  'Banco de dados'
                ],
                correctAnswer: 1,
                explanation: 'React é uma biblioteca JavaScript criada pelo Facebook para construir interfaces de usuário.'
              },
              {
                question: 'Qual comando cria um novo projeto React?',
                options: [
                  'npm create react-app',
                  'npx create-react-app meu-app',
                  'node create-react-app',
                  'react new project'
                ],
                correctAnswer: 1,
                explanation: 'O comando "npx create-react-app nome-do-projeto" é a forma oficial de criar novos projetos React.'
              },
              {
                question: 'Em JSX, qual atributo substitui "class"?',
                options: [
                  'class',
                  'css-class',
                  'className',
                  'htmlClass'
                ],
                correctAnswer: 2,
                explanation: 'Em JSX usamos "className" ao invés de "class" porque "class" é uma palavra reservada em JavaScript.'
              },
              {
                question: 'Como renderizar uma lista em React?',
                options: [
                  'Usando for loop',
                  'Usando while loop',
                  'Usando o método map()',
                  'Usando forEach()'
                ],
                correctAnswer: 2,
                explanation: 'O método map() é usado para transformar arrays em elementos JSX, retornando um novo array de componentes.'
              }
            ]
          }),
          duration_minutes: 12,
          xp_reward: 60,
          order_index: 5
        }
      ]);
    }

    // Módulo 2: Componentes e Props
    const componentesModule = modules.find(m => m.title === 'Componentes e Props');
    if (componentesModule) {
      await knex('lessons').insert([
        {
          module_id: componentesModule.id,
          title: 'Props - Passando Dados',
          description: 'Como passar e receber dados entre componentes',
          type: 'video',
          content: `# Props - Passando Dados entre Componentes

## O que são Props?

Props (properties) são argumentos passados para componentes React. Elas permitem que componentes sejam reutilizáveis com dados diferentes.

## Passando Props

\`\`\`jsx
// Componente pai
function App() {
  return (
    <div>
      <Welcome name="João" age={25} />
      <Welcome name="Maria" age={30} />
    </div>
  );
}
\`\`\`

## Recebendo Props

\`\`\`jsx
// Método 1: Objeto props
function Welcome(props) {
  return (
    <div>
      <h1>Olá, {props.name}!</h1>
      <p>Você tem {props.age} anos</p>
    </div>
  );
}

// Método 2: Destructuring
function Welcome({ name, age }) {
  return (
    <div>
      <h1>Olá, {name}!</h1>
      <p>Você tem {age} anos</p>
    </div>
  );
}
\`\`\`

## Tipos de Props

### Strings
\`\`\`jsx
<User name="João" />
\`\`\`

### Números
\`\`\`jsx
<User age={25} />
\`\`\`

### Booleanos
\`\`\`jsx
<User isActive={true} />
<User isActive />  // true implícito
\`\`\`

### Arrays e Objetos
\`\`\`jsx
<UserList users={[...]} />
<User profile={{name: 'João', age: 25}} />
\`\`\`

### Funções
\`\`\`jsx
<Button onClick={() => alert('Clicou!')} />
\`\`\`

## Props.children

\`\`\`jsx
// Componente que recebe children
function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

// Usando o componente
function App() {
  return (
    <Card>
      <h2>Título do Card</h2>
      <p>Conteúdo do card aqui</p>
    </Card>
  );
}
\`\`\`

## Default Props

\`\`\`jsx
function Button({ text = 'Clique aqui', variant = 'primary' }) {
  return <button className={variant}>{text}</button>;
}

// Ou com defaultProps
Button.defaultProps = {
  text: 'Clique aqui',
  variant: 'primary'
};
\`\`\`

## Exemplo Prático: Card de Produto

\`\`\`jsx
function ProductCard({ title, price, image, onBuy }) {
  return (
    <div className="product-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p className="price">R$ {price}</p>
      <button onClick={onBuy}>
        Comprar
      </button>
    </div>
  );
}

// Uso
function Store() {
  const handleBuy = (product) => {
    alert(\`Comprando: \${product}\`);
  };

  return (
    <div>
      <ProductCard 
        title="Smartphone"
        price={899}
        image="/phone.jpg"
        onBuy={() => handleBuy('Smartphone')}
      />
    </div>
  );
}
\`\`\`

Props são fundamentais para criar componentes reutilizáveis e modulares! 🚀`,
          video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration_minutes: 25,
          xp_reward: 40,
          order_index: 1
        },
        {
          module_id: componentesModule.id,
          title: 'Composição de Componentes',
          description: 'Criando interfaces complexas com componentes simples',
          type: 'video',
          content: `# Composição de Componentes

A composição é um dos padrões mais poderosos do React. Permite construir interfaces complexas combinando componentes simples.

## Padrão Container/Presentation

\`\`\`jsx
// Container Component (lógica)
function UserContainer() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser().then(setUser);
  }, []);
  
  if (!user) return <div>Carregando...</div>;
  
  return <UserProfile user={user} />;
}

// Presentation Component (UI)
function UserProfile({ user }) {
  return (
    <div className="user-profile">
      <Avatar src={user.avatar} />
      <UserInfo name={user.name} email={user.email} />
    </div>
  );
}
\`\`\`

## Higher-Order Components (HOC)

\`\`\`jsx
// HOC para adicionar loading
function withLoading(Component) {
  return function LoadingComponent(props) {
    if (props.isLoading) {
      return <div>Carregando...</div>;
    }
    return <Component {...props} />;
  };
}

// Uso
const UserListWithLoading = withLoading(UserList);
\`\`\`

## Render Props

\`\`\`jsx
function DataFetcher({ url, render }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [url]);
  
  return render({ data, loading });
}

// Uso
function App() {
  return (
    <DataFetcher
      url="/api/users"
      render={({ data, loading }) => (
        loading ? <div>Carregando...</div> : <UserList users={data} />
      )}
    />
  );
}
\`\`\`

## Compound Components

\`\`\`jsx
// Componente Modal com subcomponentes
function Modal({ children, isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

Modal.Header = function ModalHeader({ children }) {
  return <div className="modal-header">{children}</div>;
};

Modal.Body = function ModalBody({ children }) {
  return <div className="modal-body">{children}</div>;
};

Modal.Footer = function ModalFooter({ children }) {
  return <div className="modal-footer">{children}</div>;
};

// Uso
function App() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <Modal.Header>
        <h2>Título do Modal</h2>
      </Modal.Header>
      <Modal.Body>
        <p>Conteúdo do modal aqui</p>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={() => setIsOpen(false)}>Fechar</button>
      </Modal.Footer>
    </Modal>
  );
}
\`\`\`

A composição torna seus componentes mais flexíveis e reutilizáveis! 💪`,
          video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration_minutes: 30,
          xp_reward: 45,
          order_index: 2
        },
        {
          module_id: componentesModule.id,
          title: 'Exercício: Sistema de Cards',
          description: 'Construa um sistema de cards reutilizáveis',
          type: 'exercise',
          content: `# Exercício: Sistema de Cards Reutilizáveis

## Objetivo
Criar um sistema de cards flexível que pode ser usado para diferentes tipos de conteúdo.

## Requisitos

### 1. Componente Card Base
\`\`\`jsx
function Card({ children, variant = 'default', className = '' }) {
  return (
    <div className={\`card card--\${variant} \${className}\`}>
      {children}
    </div>
  );
}
\`\`\`

### 2. Sub-componentes
\`\`\`jsx
Card.Header = function CardHeader({ children }) {
  return <div className="card__header">{children}</div>;
};

Card.Body = function CardBody({ children }) {
  return <div className="card__body">{children}</div>;
};

Card.Footer = function CardFooter({ children }) {
  return <div className="card__footer">{children}</div>;
};

Card.Image = function CardImage({ src, alt }) {
  return <img className="card__image" src={src} alt={alt} />;
};
\`\`\`

### 3. Variantes Específicas

#### ProductCard
\`\`\`jsx
function ProductCard({ product, onAddToCart }) {
  return (
    <Card variant="product">
      <Card.Image src={product.image} alt={product.name} />
      <Card.Body>
        <h3>{product.name}</h3>
        <p className="price">R$ {product.price}</p>
        <p>{product.description}</p>
      </Card.Body>
      <Card.Footer>
        <button onClick={() => onAddToCart(product)}>
          Adicionar ao Carrinho
        </button>
      </Card.Footer>
    </Card>
  );
}
\`\`\`

#### UserCard
\`\`\`jsx
function UserCard({ user, onFollow }) {
  return (
    <Card variant="user">
      <Card.Header>
        <img src={user.avatar} alt={user.name} className="avatar" />
        <h3>{user.name}</h3>
      </Card.Header>
      <Card.Body>
        <p>{user.bio}</p>
        <div className="stats">
          <span>Seguidores: {user.followers}</span>
          <span>Seguindo: {user.following}</span>
        </div>
      </Card.Body>
      <Card.Footer>
        <button onClick={() => onFollow(user.id)}>
          Seguir
        </button>
      </Card.Footer>
    </Card>
  );
}
\`\`\`

## Desafio Extra

Implemente os seguintes recursos:

1. **Loading State**: Card com skeleton loading
2. **Error State**: Card para exibir erros
3. **Interactive Card**: Card que expande ao clicar
4. **Card Grid**: Layout responsivo para múltiplos cards

## CSS Sugerido

\`\`\`css
.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.card--product {
  max-width: 300px;
}

.card--user {
  max-width: 250px;
}

.card__header {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.card__body {
  padding: 1rem;
}

.card__footer {
  padding: 1rem;
  background: #f5f5f5;
  border-top: 1px solid #e0e0e0;
}

.card__image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
\`\`\`

## Teste sua Implementação

\`\`\`jsx
function App() {
  const products = [
    {
      id: 1,
      name: 'Smartphone',
      price: 899,
      description: 'Último modelo com câmera incrível',
      image: '/smartphone.jpg'
    }
  ];
  
  const users = [
    {
      id: 1,
      name: 'João Silva',
      avatar: '/avatar1.jpg',
      bio: 'Desenvolvedor apaixonado por React',
      followers: 1250,
      following: 340
    }
  ];
  
  return (
    <div className="app">
      <h1>Sistema de Cards</h1>
      
      <section>
        <h2>Produtos</h2>
        <div className="cards-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              onAddToCart={console.log}
            />
          ))}
        </div>
      </section>
      
      <section>
        <h2>Usuários</h2>
        <div className="cards-grid">
          {users.map(user => (
            <UserCard 
              key={user.id}
              user={user}
              onFollow={console.log}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
\`\`\`

**Boa sorte com o exercício! 🎯**`,
          duration_minutes: 45,
          xp_reward: 80,
          order_index: 3
        }
      ]);
    }

    // Módulo 3: Estado e Hooks (apenas algumas aulas como exemplo)
    const estadoModule = modules.find(m => m.title === 'Estado e Hooks');
    if (estadoModule) {
      await knex('lessons').insert([
        {
          module_id: estadoModule.id,
          title: 'useState - Gerenciando Estado',
          description: 'Hook básico para gerenciar estado local',
          type: 'video',
          content: `# useState - Gerenciando Estado Local

## O que é Estado?

Estado é dados que mudam ao longo do tempo e afetam o que é renderizado na tela.

## Sintaxe do useState

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  // [valor, função para alterar valor] = useState(valor inicial)
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrementar
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}
\`\`\`

## Tipos de Estado

### String
\`\`\`jsx
const [name, setName] = useState('');

return (
  <input 
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Digite seu nome"
  />
);
\`\`\`

### Boolean
\`\`\`jsx
const [isVisible, setIsVisible] = useState(false);

return (
  <div>
    <button onClick={() => setIsVisible(!isVisible)}>
      {isVisible ? 'Ocultar' : 'Mostrar'}
    </button>
    {isVisible && <p>Conteúdo visível!</p>}
  </div>
);
\`\`\`

### Array
\`\`\`jsx
const [items, setItems] = useState([]);

const addItem = () => {
  const newItem = \`Item \${items.length + 1}\`;
  setItems([...items, newItem]);
};

const removeItem = (index) => {
  setItems(items.filter((_, i) => i !== index));
};

return (
  <div>
    <button onClick={addItem}>Adicionar Item</button>
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {item}
          <button onClick={() => removeItem(index)}>
            Remover
          </button>
        </li>
      ))}
    </ul>
  </div>
);
\`\`\`

### Object
\`\`\`jsx
const [user, setUser] = useState({
  name: '',
  email: '',
  age: 0
});

const updateUser = (field, value) => {
  setUser(prev => ({
    ...prev,
    [field]: value
  }));
};

return (
  <form>
    <input 
      placeholder="Nome"
      onChange={(e) => updateUser('name', e.target.value)}
    />
    <input 
      placeholder="Email"
      onChange={(e) => updateUser('email', e.target.value)}
    />
    <input 
      type="number"
      placeholder="Idade"
      onChange={(e) => updateUser('age', parseInt(e.target.value))}
    />
  </form>
);
\`\`\`

## Regras Importantes

1. **Sempre use a função setter**: Nunca modifique o estado diretamente
2. **Estado é imutável**: Crie novas instâncias dos objetos/arrays
3. **Atualizações podem ser assíncronas**: Use função callback quando necessário

\`\`\`jsx
// ❌ Errado
items.push(newItem);
setItems(items);

// ✅ Correto
setItems(prev => [...prev, newItem]);

// Para múltiplas atualizações baseadas no estado anterior
setCount(prev => prev + 1);
setCount(prev => prev + 1); // Será executado corretamente
\`\`\`

O useState é fundamental para tornar seus componentes interativos! 🎮`,
          video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration_minutes: 32,
          xp_reward: 50,
          order_index: 1
        },
        {
          module_id: estadoModule.id,
          title: 'useEffect - Efeitos Colaterais',
          description: 'Gerenciando efeitos colaterais e ciclo de vida',
          type: 'video',
          content: `# useEffect - Gerenciando Efeitos Colaterais

## O que são Efeitos Colaterais?

Efeitos colaterais são operações que afetam algo fora do escopo do componente:
- Chamadas para APIs
- Manipulação do DOM
- Timers/Intervalos  
- Subscriptions

## Sintaxe Básica

\`\`\`jsx
import { useEffect, useState } from 'react';

function Component() {
  const [data, setData] = useState(null);
  
  // Executa após cada render
  useEffect(() => {
    console.log('Componente renderizou');
  });
  
  // Executa apenas uma vez (componentDidMount)
  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(setData);
  }, []); // Array de dependências vazio
  
  // Executa quando 'data' muda
  useEffect(() => {
    if (data) {
      document.title = \`Dados carregados: \${data.length} items\`;
    }
  }, [data]); // Dependência: 'data'
  
  return <div>{data ? \`\${data.length} items\` : 'Carregando...'}</div>;
}
\`\`\`

## Padrões Comuns

### 1. Carregamento de Dados
\`\`\`jsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Falha ao carregar');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  if (loading) return <div>Carregando usuários...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
\`\`\`

### 2. Cleanup (Limpeza)
\`\`\`jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    
    // Função de cleanup
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  return <div>Tempo: {seconds}s</div>;
}
\`\`\`

### 3. Event Listeners
\`\`\`jsx
function WindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <div>{windowSize.width} x {windowSize.height}</div>;
}
\`\`\`

### 4. Dependências Complexas
\`\`\`jsx
function SearchResults({ query, filters }) {
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    
    const searchData = async () => {
      const params = new URLSearchParams({
        q: query,
        ...filters
      });
      
      const response = await fetch(\`/api/search?\${params}\`);
      const data = await response.json();
      setResults(data);
    };
    
    searchData();
  }, [query, filters]); // Re-executa quando query ou filters mudam
  
  return (
    <div>
      {results.map(result => (
        <div key={result.id}>{result.title}</div>
      ))}
    </div>
  );
}
\`\`\`

## Dicas Importantes

1. **Sempre inclua dependências**: ESLint plugin ajuda
2. **Use cleanup para evitar memory leaks**
3. **Evite dependências desnecessárias**
4. **Considere usar useCallback/useMemo para otimização**

useEffect é essencial para conectar seus componentes ao mundo exterior! 🌍`,
          video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration_minutes: 38,
          xp_reward: 55,
          order_index: 2
        }
      ]);
    }
  }

  // Criar módulos básicos para outros cursos
  const jsCourse = courses.find(c => c.title === 'JavaScript Moderno - ES6+');
  if (jsCourse) {
    const jsModules = await knex('course_modules').insert([
      {
        course_id: jsCourse.id,
        title: 'ES6+ Features',
        description: 'Novas funcionalidades do JavaScript moderno',
        order_index: 1
      },
      {
        course_id: jsCourse.id,
        title: 'Async/Await e Promises',
        description: 'Programação assíncrona em JavaScript',
        order_index: 2
      },
      {
        course_id: jsCourse.id,
        title: 'Modules e Import/Export',
        description: 'Sistema de módulos ES6 e organização de código',
        order_index: 3
      },
      {
        course_id: jsCourse.id,
        title: 'Projeto: API Client',
        description: 'Construindo um cliente para consumo de APIs',
        order_index: 4
      }
    ]).returning('*');

    // Módulo ES6+ Features
    await knex('lessons').insert([
      {
        module_id: jsModules[0].id,
        title: 'Arrow Functions e Template Literals',
        description: 'Sintaxe moderna para funções e strings',
        type: 'video',
        content: `# Arrow Functions e Template Literals

## Arrow Functions

Arrow functions oferecem uma sintaxe mais concisa para escrever funções em JavaScript.

### Sintaxe Básica
\`\`\`javascript
// Função tradicional
function soma(a, b) {
  return a + b;
}

// Arrow function
const soma = (a, b) => a + b;

// Com múltiplas linhas
const calcular = (a, b) => {
  const resultado = a + b;
  return resultado * 2;
};
\`\`\`

### Casos de Uso Comuns
\`\`\`javascript
// Array methods
const numeros = [1, 2, 3, 4, 5];

const dobrados = numeros.map(n => n * 2);
const pares = numeros.filter(n => n % 2 === 0);
const soma = numeros.reduce((acc, n) => acc + n, 0);

// Event handlers
button.addEventListener('click', () => {
  console.log('Botão clicado!');
});

// Métodos de objeto (cuidado com o this)
const usuario = {
  nome: 'João',
  saudar() {
    // Use function normal para manter o 'this'
    setTimeout(() => {
      console.log(\`Olá, \${this.nome}!\`);
    }, 1000);
  }
};
\`\`\`

## Template Literals

Template literals permitem interpolar expressões em strings usando crases.

### Sintaxe
\`\`\`javascript
const nome = 'Maria';
const idade = 25;

// Template literal
const mensagem = \`Olá, meu nome é \${nome} e tenho \${idade} anos.\`;

// Múltiplas linhas
const html = \`
  <div class="user-card">
    <h2>\${nome}</h2>
    <p>Idade: \${idade}</p>
  </div>
\`;

// Expressões complexas
const preco = 29.99;
const desconto = 0.1;
const total = \`Total: R$ \${(preco * (1 - desconto)).toFixed(2)}\`;
\`\`\`

### Tagged Templates
\`\`\`javascript
function highlight(strings, ...values) {
  return strings.reduce((result, string, i) => {
    const value = values[i] ? \`<mark>\${values[i]}</mark>\` : '';
    return result + string + value;
  }, '');
}

const nome = 'João';
const profissao = 'desenvolvedor';
const texto = highlight\`Meu nome é \${nome} e sou \${profissao}.\`;
\`\`\`

Arrow functions e template literals tornam o código mais limpo e expressivo! ✨`,
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration_minutes: 22,
        xp_reward: 35,
        order_index: 1,
        is_free: true
      },
      {
        module_id: jsModules[0].id,
        title: 'Destructuring Assignment',
        description: 'Extraindo valores de objetos e arrays',
        type: 'video',
        content: `# Destructuring Assignment

Destructuring permite extrair valores de arrays e propriedades de objetos de forma concisa.

## Array Destructuring

### Básico
\`\`\`javascript
const cores = ['vermelho', 'verde', 'azul'];

// Método tradicional
const primeira = cores[0];
const segunda = cores[1];

// Destructuring
const [primeira, segunda, terceira] = cores;

// Pular elementos
const [primeira, , terceira] = cores;

// Valores padrão
const [primeira, segunda, terceira, quarta = 'amarelo'] = cores;
\`\`\`

### Casos Avançados
\`\`\`javascript
// Trocar variáveis
let a = 1, b = 2;
[a, b] = [b, a]; // a = 2, b = 1

// Rest operator
const [primeiro, ...resto] = [1, 2, 3, 4, 5];
// primeiro = 1, resto = [2, 3, 4, 5]

// Nested destructuring
const matriz = [[1, 2], [3, 4]];
const [[a, b], [c, d]] = matriz;
\`\`\`

## Object Destructuring

### Básico
\`\`\`javascript
const usuario = {
  nome: 'João',
  idade: 30,
  email: 'joao@email.com',
  endereco: {
    cidade: 'São Paulo',
    estado: 'SP'
  }
};

// Método tradicional
const nome = usuario.nome;
const idade = usuario.idade;

// Destructuring
const { nome, idade, email } = usuario;

// Renomear variáveis
const { nome: nomeUsuario, idade: idadeUsuario } = usuario;

// Valores padrão
const { nome, profissao = 'Não informado' } = usuario;
\`\`\`

### Casos Avançados
\`\`\`javascript
// Nested destructuring
const { endereco: { cidade, estado } } = usuario;

// Rest operator
const { nome, ...outrosDados } = usuario;

// Destructuring em parâmetros de função
function saudar({ nome, idade }) {
  return \`Olá \${nome}, você tem \${idade} anos\`;
}

saudar(usuario);

// Com valores padrão em parâmetros
function criarUsuario({ nome, idade = 18, ativo = true }) {
  return { nome, idade, ativo };
}
\`\`\`

## Casos Práticos

### APIs e Fetch
\`\`\`javascript
// Destructuring na resposta da API
const { data, status, message } = await fetch('/api/users')
  .then(res => res.json());

// Múltiplas chamadas
const [usuarios, produtos, pedidos] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/products').then(r => r.json()),
  fetch('/api/orders').then(r => r.json())
]);
\`\`\`

### React (Preview)
\`\`\`javascript
// Props destructuring
function UserCard({ nome, idade, avatar, onEdit }) {
  return (
    <div>
      <img src={avatar} alt={nome} />
      <h3>{nome}</h3>
      <p>{idade} anos</p>
      <button onClick={onEdit}>Editar</button>
    </div>
  );
}

// State destructuring
const [loading, setLoading] = useState(false);
const [user, setUser] = useState(null);
\`\`\`

### Módulos
\`\`\`javascript
// Import destructuring
import { useState, useEffect, useContext } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
\`\`\`

Destructuring torna o código mais limpo e expressivo! 🎯`,
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration_minutes: 25,
        xp_reward: 40,
        order_index: 2
      },
      {
        module_id: jsModules[0].id,
        title: 'Spread e Rest Operators',
        description: 'Operadores ... para arrays e objetos',
        type: 'text',
        content: `# Spread e Rest Operators

Os operadores \`...\` (três pontos) têm dois usos principais: spread e rest.

## Spread Operator

O spread operator "espalha" elementos de arrays ou propriedades de objetos.

### Arrays
\`\`\`javascript
const numeros1 = [1, 2, 3];
const numeros2 = [4, 5, 6];

// Concatenar arrays
const todosNumeros = [...numeros1, ...numeros2]; // [1, 2, 3, 4, 5, 6]

// Adicionar elementos
const comZero = [0, ...numeros1]; // [0, 1, 2, 3]
const comSete = [...numeros1, 7]; // [1, 2, 3, 7]

// Copiar array (shallow copy)
const copia = [...numeros1]; // [1, 2, 3]

// Converter string em array
const letras = [...'hello']; // ['h', 'e', 'l', 'l', 'o']

// Math.max com array
const maximo = Math.max(...numeros1); // 3
\`\`\`

### Objetos
\`\`\`javascript
const usuario = { nome: 'João', idade: 30 };
const endereco = { cidade: 'São Paulo', cep: '01234-567' };

// Mesclar objetos
const usuarioCompleto = { ...usuario, ...endereco };
// { nome: 'João', idade: 30, cidade: 'São Paulo', cep: '01234-567' }

// Copiar objeto
const copiaUsuario = { ...usuario };

// Sobrescrever propriedades
const usuarioAtualizado = { 
  ...usuario, 
  idade: 31, 
  profissao: 'Desenvolvedor' 
};
\`\`\`

### Casos Práticos
\`\`\`javascript
// Adicionar item ao array (imutável)
const todos = ['Estudar', 'Trabalhar'];
const novosTodos = [...todos, 'Exercitar'];

// Remover item do array
const index = 1;
const todosSemItem = [
  ...todos.slice(0, index),
  ...todos.slice(index + 1)
];

// Atualizar propriedade de objeto
const estado = {
  usuario: { nome: 'João', idade: 30 },
  configuracoes: { tema: 'claro' }
};

const novoEstado = {
  ...estado,
  usuario: {
    ...estado.usuario,
    idade: 31
  }
};
\`\`\`

## Rest Operator

O rest operator "coleta" elementos restantes.

### Em Destructuring
\`\`\`javascript
// Arrays
const [primeiro, segundo, ...resto] = [1, 2, 3, 4, 5];
// primeiro = 1, segundo = 2, resto = [3, 4, 5]

// Objetos
const { nome, idade, ...outrosDados } = {
  nome: 'João',
  idade: 30,
  cidade: 'SP',
  profissao: 'Dev'
};
// nome = 'João', idade = 30, outrosDados = { cidade: 'SP', profissao: 'Dev' }
\`\`\`

### Em Parâmetros de Função
\`\`\`javascript
// Função com número variável de argumentos
function somar(...numeros) {
  return numeros.reduce((acc, num) => acc + num, 0);
}

somar(1, 2, 3, 4); // 10

// Parâmetros nomeados + rest
function criarMensagem(tipo, ...valores) {
  return \`\${tipo}: \${valores.join(', ')}\`;
}

criarMensagem('Erro', 'Campo obrigatório', 'Email inválido');
// 'Erro: Campo obrigatório, Email inválido'
\`\`\`

### Casos Avançados
\`\`\`javascript
// Wrapper de função
function loggerWrapper(fn) {
  return function(...args) {
    console.log('Chamando função com:', args);
    const resultado = fn(...args);
    console.log('Resultado:', resultado);
    return resultado;
  };
}

const somaComLog = loggerWrapper(somar);
somaComLog(1, 2, 3); // Logs + resultado

// Configurações opcionais
function configurarAPI({ 
  baseURL, 
  timeout = 5000, 
  ...outrasConfigs 
}) {
  return {
    baseURL,
    timeout,
    ...outrasConfigs
  };
}

configurarAPI({
  baseURL: '/api',
  retries: 3,
  cache: true
});
\`\`\`

## Boas Práticas

1. **Use spread para manter imutabilidade**
2. **Rest deve ser o último parâmetro**
3. **Cuidado com shallow copy em objetos aninhados**
4. **Prefira destructuring com rest para extrair dados**

Os operadores spread/rest são essenciais para programação funcional! 🌟`,
        duration_minutes: 20,
        xp_reward: 45,
        order_index: 3
      }
    ]);
  }

  // Python Data Science Course
  const pythonCourse = courses.find(c => c.title === 'Python para Data Science');
  if (pythonCourse) {
    const pythonModules = await knex('course_modules').insert([
      {
        course_id: pythonCourse.id,
        title: 'Python Fundamentals',
        description: 'Sintaxe básica, estruturas de dados e controle de fluxo',
        order_index: 1
      },
      {
        course_id: pythonCourse.id,
        title: 'NumPy e Arrays',
        description: 'Computação numérica eficiente com NumPy',
        order_index: 2
      },
      {
        course_id: pythonCourse.id,
        title: 'Pandas para Análise',
        description: 'Manipulação e análise de dados com Pandas',
        order_index: 3
      },
      {
        course_id: pythonCourse.id,
        title: 'Visualização de Dados',
        description: 'Matplotlib, Seaborn e plotly para gráficos',
        order_index: 4
      },
      {
        course_id: pythonCourse.id,
        title: 'Machine Learning Básico',
        description: 'Scikit-learn e algoritmos fundamentais',
        order_index: 5
      }
    ]).returning('*');

    // Adicionar algumas aulas ao primeiro módulo
    await knex('lessons').insert([
      {
        module_id: pythonModules[0].id,
        title: 'Configurando Ambiente Python',
        description: 'Anaconda, Jupyter Notebook e bibliotecas essenciais',
        type: 'video',
        content: `# Configurando Ambiente Python para Data Science

## Instalação do Anaconda

### Download e Instalação
1. Acesse: https://www.anaconda.com/products/distribution
2. Baixe a versão Python 3.x
3. Execute o instalador
4. Marque "Add Anaconda to PATH"

### Verificação
\`\`\`bash
conda --version
python --version
jupyter --version
\`\`\`

## Principais Ferramentas

### Jupyter Notebook
\`\`\`bash
# Iniciar Jupyter
jupyter notebook

# Ou Jupyter Lab (mais moderno)
jupyter lab
\`\`\`

### Bibliotecas Essenciais
\`\`\`bash
# Já incluídas no Anaconda
pandas      # Análise de dados
numpy       # Computação numérica  
matplotlib  # Gráficos básicos
seaborn     # Gráficos estatísticos
scikit-learn # Machine Learning
jupyter     # Notebooks interativos

# Instalar bibliotecas adicionais
conda install plotly
pip install kaggle
\`\`\`

## Primeiro Notebook

\`\`\`python
# Importações básicas
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Configurações
plt.style.use('seaborn-v0_8')
pd.set_option('display.max_columns', None)

# Teste
print("Ambiente configurado com sucesso!")
print(f"Pandas versão: {pd.__version__}")
print(f"NumPy versão: {np.__version__}")
\`\`\`

### Estrutura de Projeto
\`\`\`
projeto-data-science/
├── data/
│   ├── raw/          # Dados originais
│   ├── processed/    # Dados processados
│   └── external/     # Dados externos
├── notebooks/        # Jupyter notebooks
├── src/             # Código Python
├── reports/         # Relatórios e gráficos
└── requirements.txt # Dependências
\`\`\`

Ambiente pronto para análise de dados! 🐍📊`,
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration_minutes: 15,
        xp_reward: 30,
        order_index: 1,
        is_free: true
      }
    ]);
  }

  // Adicionar mais conteúdo para outros cursos...
  const mlCourse = courses.find(c => c.title === 'Machine Learning com Python');
  if (mlCourse) {
    await knex('course_modules').insert([
      {
        course_id: mlCourse.id,
        title: 'Fundamentos de ML',
        description: 'Conceitos básicos, tipos de aprendizado e workflow',
        order_index: 1
      },
      {
        course_id: mlCourse.id,
        title: 'Pré-processamento',
        description: 'Limpeza, transformação e preparação de dados',
        order_index: 2
      },
      {
        course_id: mlCourse.id,
        title: 'Algoritmos Supervisionados',
        description: 'Classificação e regressão com scikit-learn',
        order_index: 3
      },
      {
        course_id: mlCourse.id,
        title: 'Deep Learning',
        description: 'Redes neurais com TensorFlow e Keras',
        order_index: 4
      },
      {
        course_id: mlCourse.id,
        title: 'Projeto Final',
        description: 'Sistema completo de recomendação',
        order_index: 5
      }
    ]);
  }

  console.log('✅ Cursos completos criados com conteúdo rico!');
}
