// FILE: /backend/src/database/seeds/005_additional_courses.ts
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Buscar ou criar usutor instrutor padrão
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

  // Criar novos cursos adicionais
  const newCourses = await knex('courses').insert([
    {
      title: 'Flutter & Dart - Desenvolvimento Mobile',
      description: 'Crie aplicativos nativos para Android e iOS com Flutter. Aprenda Dart, widgets, animações, integração com APIs e publique na Play Store.',
      category: 'Mobile',
      difficulty: 'Intermediário',
      cover_image_url: '/images/courses/flutter-course.jpg',
      estimated_hours: 55,
      xp_reward: 1200,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    },
    {
      title: 'Angular 17 - Framework Completo',
      description: 'Domine o Angular com TypeScript, RxJS, Angular Material, testes unitários e desenvolvimento de SPAs profissionais.',
      category: 'Desenvolvimento Web',
      difficulty: 'Avançado',
      cover_image_url: '/images/courses/angular-course.jpg',
      estimated_hours: 65,
      xp_reward: 1400,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    },
    {
      title: 'Inteligência Artificial com TensorFlow',
      description: 'Construa modelos de Deep Learning, redes neurais, processamento de imagem e NLP com TensorFlow e Keras.',
      category: 'Inteligência Artificial',
      difficulty: 'Avançado',
      cover_image_url: '/images/courses/tensorflow-course.jpg',
      estimated_hours: 80,
      xp_reward: 1800,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    },
    {
      title: 'Blockchain e Criptomoedas',
      description: 'Entenda blockchain, crie smart contracts com Solidity, desenvolva DApps e explore o mundo das criptomoedas.',
      category: 'Blockchain',
      difficulty: 'Avançado',
      cover_image_url: '/images/courses/blockchain-course.jpg',
      estimated_hours: 70,
      xp_reward: 1600,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    },
    {
      title: 'Go Lang - Programação Concorrente',
      description: 'Aprenda Go (Golang) para backend de alta performance, microserviços, goroutines e desenvolvimento em nuvem.',
      category: 'Backend',
      difficulty: 'Intermediário',
      cover_image_url: '/images/courses/golang-course.jpg',
      estimated_hours: 45,
      xp_reward: 1000,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    },
    {
      title: 'Rust - Programação de Sistema',
      description: 'Domine Rust para programação de sistema, performance extrema, segurança de memória e desenvolvimento de ferramentas.',
      category: 'Sistemas',
      difficulty: 'Avançado',
      cover_image_url: '/images/courses/rust-course.jpg',
      estimated_hours: 60,
      xp_reward: 1300,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    },
    {
      title: 'Kubernetes - Orquestração de Containers',
      description: 'Gerencie aplicações em escala com Kubernetes, deploy automatizado, monitoramento e arquitetura de microserviços.',
      category: 'DevOps',
      difficulty: 'Avançado',
      cover_image_url: '/images/courses/kubernetes-course.jpg',
      estimated_hours: 50,
      xp_reward: 1200,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    },
    {
      title: 'Unity - Desenvolvimento de Jogos 3D',
      description: 'Crie jogos 3D profissionais com Unity e C#. Física, animações, IA, multiplayer e publicação nas principais plataformas.',
      category: 'Game Development',
      difficulty: 'Intermediário',
      cover_image_url: '/images/courses/unity-course.jpg',
      estimated_hours: 75,
      xp_reward: 1500,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    },
    {
      title: 'GraphQL - APIs Modernas',
      description: 'Construa APIs eficientes com GraphQL, Apollo Server, subscriptions em tempo real e integração com databases.',
      category: 'Backend',
      difficulty: 'Intermediário',
      cover_image_url: '/images/courses/graphql-course.jpg',
      estimated_hours: 40,
      xp_reward: 900,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    },
    {
      title: 'Next.js 14 - Full-Stack React',
      description: 'Desenvolva aplicações full-stack com Next.js, Server Components, App Router, autenticação e deploy na Vercel.',
      category: 'Full-Stack',
      difficulty: 'Intermediário',
      cover_image_url: '/images/courses/nextjs-course.jpg',
      estimated_hours: 55,
      xp_reward: 1200,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    },
    {
      title: 'Spring Boot - Java Enterprise',
      description: 'Crie aplicações enterprise robustas com Spring Boot, JPA, Security, testes e integração com bancos de dados.',
      category: 'Backend',
      difficulty: 'Intermediário',
      cover_image_url: '/images/courses/spring-course.jpg',
      estimated_hours: 65,
      xp_reward: 1400,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    },
    {
      title: 'Svelte & SvelteKit - Framework Moderno',
      description: 'Aprenda Svelte, o framework mais rápido para web, com SvelteKit para aplicações full-stack e performance otimizada.',
      category: 'Desenvolvimento Web',
      difficulty: 'Intermediário',
      cover_image_url: '/images/courses/svelte-course.jpg',
      estimated_hours: 35,
      xp_reward: 800,
      instructor_id: instructor.id,
      is_published: true,
      is_active: true
    }
  ]).returning('*');

  // Criar módulos para Flutter & Dart
  const flutterModules = await knex('course_modules').insert([
    {
      course_id: newCourses[0].id,
      title: 'Fundamentos do Flutter',
      description: 'Introdução ao Flutter, Dart e configuração do ambiente',
      module_order: 1,
      estimated_hours: 8,
      xp_reward: 120
    },
    {
      course_id: newCourses[0].id,
      title: 'Widgets e Layout',
      description: 'Widgets essenciais, layout flexível e responsive design',
      module_order: 2,
      estimated_hours: 12,
      xp_reward: 180
    },
    {
      course_id: newCourses[0].id,
      title: 'Estado e Navegação',
      description: 'Gerenciamento de estado com Provider e navegação entre telas',
      module_order: 3,
      estimated_hours: 10,
      xp_reward: 150
    },
    {
      course_id: newCourses[0].id,
      title: 'APIs e Banco de Dados',
      description: 'Integração com APIs REST, SQLite e armazenamento local',
      module_order: 4,
      estimated_hours: 15,
      xp_reward: 225
    },
    {
      course_id: newCourses[0].id,
      title: 'Publicação e Deploy',
      description: 'Preparação para produção, testes e publicação nas lojas',
      module_order: 5,
      estimated_hours: 10,
      xp_reward: 150
    }
  ]).returning('*');

  // Criar módulos para Angular 17
  const angularModules = await knex('course_modules').insert([
    {
      course_id: newCourses[1].id,
      title: 'Angular Fundamentos',
      description: 'TypeScript, componentes, serviços e dependency injection',
      module_order: 1,
      estimated_hours: 15,
      xp_reward: 200
    },
    {
      course_id: newCourses[1].id,
      title: 'Roteamento e Guards',
      description: 'Sistema de rotas, guards de navegação e lazy loading',
      module_order: 2,
      estimated_hours: 12,
      xp_reward: 180
    },
    {
      course_id: newCourses[1].id,
      title: 'Formulários e Validação',
      description: 'Formulários reativos, validação customizada e UX',
      module_order: 3,
      estimated_hours: 10,
      xp_reward: 150
    },
    {
      course_id: newCourses[1].id,
      title: 'HTTP e Observables',
      description: 'RxJS, operadores, interceptadores e error handling',
      module_order: 4,
      estimated_hours: 13,
      xp_reward: 195
    },
    {
      course_id: newCourses[1].id,
      title: 'Testes e Produção',
      description: 'Unit tests, e2e tests, build optimization e deploy',
      module_order: 5,
      estimated_hours: 15,
      xp_reward: 225
    }
  ]).returning('*');

  // Criar módulos para TensorFlow
  const tensorflowModules = await knex('course_modules').insert([
    {
      course_id: newCourses[2].id,
      title: 'Introdução ao ML',
      description: 'Conceitos de Machine Learning e configuração do ambiente',
      module_order: 1,
      estimated_hours: 12,
      xp_reward: 180
    },
    {
      course_id: newCourses[2].id,
      title: 'Redes Neurais',
      description: 'Perceptrons, backpropagation e redes densas',
      module_order: 2,
      estimated_hours: 18,
      xp_reward: 270
    },
    {
      course_id: newCourses[2].id,
      title: 'Deep Learning',
      description: 'CNNs, RNNs, LSTM e transfer learning',
      module_order: 3,
      estimated_hours: 25,
      xp_reward: 375
    },
    {
      course_id: newCourses[2].id,
      title: 'Computer Vision',
      description: 'Processamento de imagens, detecção de objetos e classificação',
      module_order: 4,
      estimated_hours: 15,
      xp_reward: 225
    },
    {
      course_id: newCourses[2].id,
      title: 'NLP e Deploy',
      description: 'Processamento de linguagem natural e deploy de modelos',
      module_order: 5,
      estimated_hours: 10,
      xp_reward: 150
    }
  ]).returning('*');

  // Criar lições para Flutter - Módulo 1
  await knex('lessons').insert([
    {
      course_module_id: flutterModules[0].id,
      title: 'Instalação e Setup do Flutter',
      description: 'Configure o ambiente de desenvolvimento Flutter',
      lesson_order: 1,
      content_type: 'video',
      video_url: 'https://www.youtube.com/watch?v=C-fKAzdTrLU',
      content_markdown: `# Instalação e Setup do Flutter

## Pré-requisitos
- Visual Studio Code ou Android Studio
- Git instalado
- Dispositivo Android ou iOS (emulador ou físico)

## Passos da Instalação

### 1. Download do Flutter SDK
Baixe o Flutter SDK do site oficial: https://flutter.dev

### 2. Configuração do PATH
Adicione o diretório bin do Flutter ao seu PATH do sistema.

### 3. Verificação da Instalação
\`\`\`bash
flutter doctor
\`\`\`

Este comando verificará se tudo está configurado corretamente.

## Primeiro Projeto

\`\`\`bash
flutter create meu_primeiro_app
cd meu_primeiro_app
flutter run
\`\`\`

Parabéns! Você criou seu primeiro app Flutter! 🎉`,
      estimated_minutes: 15,
      xp_reward: 20
    },
    {
      course_module_id: flutterModules[0].id,
      title: 'Linguagem Dart Essencial',
      description: 'Fundamentos da linguagem Dart para Flutter',
      lesson_order: 2,
      content_type: 'video',
      video_url: 'https://www.youtube.com/watch?v=Ej_Pcr4uC2Q',
      content_markdown: `# Linguagem Dart Essencial

## Variáveis e Tipos

\`\`\`dart
// Declaração de variáveis
String nome = 'Flutter';
int idade = 5;
double preco = 99.99;
bool ativo = true;

// Variável dinâmica
var dinamica = 'Pode ser qualquer tipo';

// Variável final e const
final String finalVar = 'Não pode mudar';
const String constVar = 'Constante de compilação';
\`\`\`

## Funções

\`\`\`dart
// Função básica
String saudar(String nome) {
  return 'Olá, $nome!';
}

// Função arrow
String saudarArrow(String nome) => 'Olá, $nome!';

// Função com parâmetros opcionais
void criarUsuario(String nome, {int? idade, String? email}) {
  print('Nome: $nome, Idade: $idade, Email: $email');
}
\`\`\`

## Classes e Objetos

\`\`\`dart
class Pessoa {
  String nome;
  int idade;
  
  // Construtor
  Pessoa(this.nome, this.idade);
  
  // Método
  void apresentar() {
    print('Eu sou $nome e tenho $idade anos');
  }
}

// Uso
var pessoa = Pessoa('João', 25);
pessoa.apresentar();
\`\`\``,
      estimated_minutes: 25,
      xp_reward: 30
    },
    {
      course_module_id: flutterModules[0].id,
      title: 'Estrutura de um App Flutter',
      description: 'Entenda a anatomia de uma aplicação Flutter',
      lesson_order: 3,
      content_type: 'video',
      video_url: 'https://www.youtube.com/watch?v=1gDhl4leEzA',
      content_markdown: `# Estrutura de um App Flutter

## Arquivos Importantes

### pubspec.yaml
Arquivo de configuração do projeto, dependências e assets.

\`\`\`yaml
name: meu_app
description: Minha aplicação Flutter

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.0

dev_dependencies:
  flutter_test:
    sdk: flutter
\`\`\`

### lib/main.dart
Ponto de entrada da aplicação.

\`\`\`dart
import 'package:flutter/material.dart';

void main() {
  runApp(MeuApp());
}

class MeuApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Meu App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'Página Inicial'),
    );
  }
}
\`\`\`

## Widget Tree
Flutter é baseado em uma árvore de widgets. Cada elemento da UI é um widget.

## Hot Reload
Uma das principais vantagens do Flutter - mudanças instantâneas durante o desenvolvimento!`,
      estimated_minutes: 20,
      xp_reward: 25
    }
  ]);

  // Criar lições para Angular - Módulo 1
  await knex('lessons').insert([
    {
      course_module_id: angularModules[0].id,
      title: 'Setup do Angular 17',
      description: 'Configuração do ambiente e primeiro projeto',
      lesson_order: 1,
      content_type: 'video',
      video_url: 'https://www.youtube.com/watch?v=3qBXWUpoPHo',
      content_markdown: `# Setup do Angular 17

## Instalação do Angular CLI

\`\`\`bash
npm install -g @angular/cli@17
\`\`\`

## Criando um Novo Projeto

\`\`\`bash
ng new meu-projeto-angular
cd meu-projeto-angular
ng serve
\`\`\`

## Estrutura do Projeto

- **src/app/** - Código da aplicação
- **src/assets/** - Imagens, ícones, etc.
- **angular.json** - Configurações do projeto
- **package.json** - Dependências do Node.js

## Novidades do Angular 17

- **Novo Angular Control Flow** (@if, @for, @switch)
- **Server-Side Rendering melhorado**
- **Vite e Webpack support**
- **Standalone Components por padrão**

## Primeiro Component

\`\`\`typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <h1>Bem-vindo ao Angular 17!</h1>
    <p>Esta é minha primeira aplicação.</p>
  \`,
  styles: [\`
    h1 { color: #3f51b5; }
  \`]
})
export class AppComponent {
  title = 'meu-projeto-angular';
}
\`\`\``,
      estimated_minutes: 20,
      xp_reward: 30
    },
    {
      course_module_id: angularModules[0].id,
      title: 'TypeScript para Angular',
      description: 'TypeScript essencial para desenvolvimento Angular',
      lesson_order: 2,
      content_type: 'video',
      video_url: 'https://www.youtube.com/watch?v=BwuLxPH8IDs',
      content_markdown: `# TypeScript para Angular

## Tipos Básicos

\`\`\`typescript
// Tipos primitivos
let nome: string = 'Angular';
let versao: number = 17;
let ativo: boolean = true;

// Arrays
let frameworks: string[] = ['Angular', 'React', 'Vue'];
let numeros: Array<number> = [1, 2, 3, 4, 5];

// Objetos
interface Usuario {
  id: number;
  nome: string;
  email?: string; // Opcional
}

let usuario: Usuario = {
  id: 1,
  nome: 'João'
};
\`\`\`

## Classes e Herança

\`\`\`typescript
class Animal {
  constructor(public nome: string) {}
  
  mover(distancia: number): void {
    console.log(\`\${this.nome} se moveu \${distancia} metros\`);
  }
}

class Cachorro extends Animal {
  constructor(nome: string, public raca: string) {
    super(nome);
  }
  
  latir(): void {
    console.log('Au au!');
  }
}
\`\`\`

## Decorators

\`\`\`typescript
// Decorator de classe
@Component({
  selector: 'app-exemplo'
})
class ExemploComponent {}

// Decorator de propriedade
class MinhaClasse {
  @Input() dados: any[];
  @Output() evento = new EventEmitter();
}
\`\`\``,
      estimated_minutes: 30,
      xp_reward: 40
    }
  ]);

  // Criar lições para TensorFlow - Módulo 1
  await knex('lessons').insert([
    {
      course_module_id: tensorflowModules[0].id,
      title: 'O que é Machine Learning?',
      description: 'Conceitos fundamentais de aprendizado de máquina',
      lesson_order: 1,
      content_type: 'video',
      video_url: 'https://www.youtube.com/watch?v=aircAruvnKk',
      content_markdown: `# O que é Machine Learning?

## Definição
Machine Learning é uma subárea da Inteligência Artificial que permite que computadores aprendam e tomem decisões com base em dados, sem serem explicitamente programados para cada tarefa.

## Tipos de Aprendizado

### 1. Aprendizado Supervisionado
- Utiliza dados rotulados
- Exemplos: classificação, regressão
- Algoritmos: Regressão Linear, SVM, Random Forest

### 2. Aprendizado Não Supervisionado
- Utiliza dados não rotulados
- Exemplos: clustering, redução de dimensionalidade
- Algoritmos: K-means, PCA

### 3. Aprendizado por Reforço
- Aprende através de tentativa e erro
- Exemplos: jogos, robótica
- Algoritmos: Q-Learning, Deep Q-Network

## Aplicações Práticas

- 🔍 **Recomendações** - Netflix, Spotify, Amazon
- 🚗 **Carros Autônomos** - Tesla, Google
- 💬 **Assistentes Virtuais** - Siri, Alexa, Google Assistant
- 🏥 **Diagnóstico Médico** - Detecção de câncer, análise de imagens
- 💰 **Detecção de Fraude** - Bancos e cartões de crédito

## Por que TensorFlow?

- Desenvolvido pelo Google
- Open source e gratuito
- Suporte para Python, JavaScript, Swift
- Comunidade ativa e extensa documentação
- Funciona em CPUs, GPUs e TPUs`,
      estimated_minutes: 25,
      xp_reward: 35
    },
    {
      course_module_id: tensorflowModules[0].id,
      title: 'Instalação do TensorFlow',
      description: 'Configure seu ambiente para Deep Learning',
      lesson_order: 2,
      content_type: 'video',
      video_url: 'https://www.youtube.com/watch?v=hHWkvEcDBO0',
      content_markdown: `# Instalação do TensorFlow

## Pré-requisitos

### Python 3.8-3.11
\`\`\`bash
python --version
\`\`\`

### Criar Ambiente Virtual
\`\`\`bash
python -m venv tf_env
# Windows
tf_env\\Scripts\\activate
# macOS/Linux
source tf_env/bin/activate
\`\`\`

## Instalação

### TensorFlow CPU
\`\`\`bash
pip install tensorflow
\`\`\`

### TensorFlow GPU (Opcional)
\`\`\`bash
pip install tensorflow-gpu
\`\`\`

### Dependências Adicionais
\`\`\`bash
pip install numpy pandas matplotlib seaborn jupyter
\`\`\`

## Verificação da Instalação

\`\`\`python
import tensorflow as tf
print("TensorFlow versão:", tf.__version__)
print("GPU disponível:", tf.config.list_physical_devices('GPU'))

# Teste básico
hello = tf.constant('Hello, TensorFlow!')
print(hello)
\`\`\`

## Google Colab
Alternativa gratuita com GPU:
- Acesse: https://colab.research.google.com
- TensorFlow já instalado
- GPUs gratuitas disponíveis

## Jupyter Notebook
\`\`\`bash
pip install jupyter
jupyter notebook
\`\`\`

Agora você está pronto para começar com Machine Learning! 🚀`,
      estimated_minutes: 20,
      xp_reward: 30
    }
  ]);

  console.log('✅ Novos cursos adicionais criados com sucesso!');
  console.log(`📚 Total de ${newCourses.length} novos cursos adicionados`);
}
