// FILE: /backend/src/database/seeds/003_sample_chat_data.ts
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Buscar usuários existentes
  const instructor = await knex('users').where('email', 'instructor@saberemfluxo.com').first();
  
  // Criar usuários estudantes de exemplo se não existirem
  let students = await knex('users').whereIn('email', [
    'aluno1@example.com',
    'aluno2@example.com', 
    'aluno3@example.com'
  ]);

  if (students.length === 0) {
    students = await knex('users').insert([
      {
        email: 'aluno1@example.com',
        first_name: 'Maria',
        last_name: 'Silva',
        password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'student',
        is_email_verified: true,
        is_active: true,
        player_class: 'WARRIOR',
        level: 15,
        xp_points: 2250
      },
      {
        email: 'aluno2@example.com',
        first_name: 'Pedro',
        last_name: 'Santos',
        password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'student',
        is_email_verified: true,
        is_active: true,
        player_class: 'ARCHER',
        level: 12,
        xp_points: 1800
      },
      {
        email: 'aluno3@example.com',
        first_name: 'Ana',
        last_name: 'Costa',
        password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'student',
        is_email_verified: true,
        is_active: true,
        player_class: 'MAGE',
        level: 18,
        xp_points: 3200
      }
    ]).returning('*');
  }

  // Limpar dados existentes
  await knex('chat_messages').del();
  await knex('chat_channels').del();

  // Criar canais de chat
  const channels = await knex('chat_channels').insert([
    {
      name: 'Geral',
      description: 'Canal geral para discussões da comunidade',
      type: 'public',
      created_by: instructor.id,
      is_active: true
    },
    {
      name: 'React - Dúvidas',
      description: 'Canal para dúvidas sobre React.js',
      type: 'public',
      created_by: instructor.id,
      is_active: true
    },
    {
      name: 'JavaScript - ES6+',
      description: 'Discussões sobre JavaScript moderno',
      type: 'public',
      created_by: instructor.id,
      is_active: true
    },
    {
      name: 'Projetos',
      description: 'Compartilhe seus projetos e receba feedback',
      type: 'public',
      created_by: instructor.id,
      is_active: true
    },
    {
      name: 'Suporte',
      description: 'Canal para suporte técnico da plataforma',
      type: 'public',
      created_by: instructor.id,
      is_active: true
    }
  ]).returning('*');

  // Mensagens de exemplo no canal Geral
  const generalChannel = channels.find(c => c.name === 'Geral');
  const reactChannel = channels.find(c => c.name === 'React - Dúvidas');

  if (generalChannel) {
    await knex('chat_messages').insert([
      {
        channel_id: generalChannel.id,
        user_id: instructor.id,
        message: '👋 Bem-vindos ao Saber em Fluxo! Este é o canal geral da nossa comunidade.',
        message_type: 'text',
        created_at: knex.fn.now()
      },
      {
        channel_id: generalChannel.id,
        user_id: students[0].id,
        message: 'Olá pessoal! Muito animada para começar os cursos! 🚀',
        message_type: 'text',
        created_at: knex.raw("datetime('now', '-1 hour')")
      },
      {
        channel_id: generalChannel.id,
        user_id: students[1].id,
        message: 'Alguém mais está fazendo o curso de React? Podemos formar um grupo de estudos!',
        message_type: 'text',
        created_at: knex.raw("datetime('now', '-45 minutes')")
      },
      {
        channel_id: generalChannel.id,
        user_id: students[2].id,
        message: 'Eu estou! Já terminei o primeiro módulo. Muito bom! 📚',
        message_type: 'text',
        created_at: knex.raw("datetime('now', '-30 minutes')")
      },
      {
        channel_id: generalChannel.id,
        user_id: instructor.id,
        message: 'Que ótimo ver vocês interagindo! Lembrem-se: dúvidas são sempre bem-vindas! 💡',
        message_type: 'text',
        created_at: knex.raw("datetime('now', '-15 minutes')")
      }
    ]);
  }

  if (reactChannel) {
    await knex('chat_messages').insert([
      {
        channel_id: reactChannel.id,
        user_id: students[0].id,
        message: 'Tenho uma dúvida sobre hooks. Quando devo usar useEffect vs useState?',
        message_type: 'text',
        created_at: knex.raw("datetime('now', '-2 hours')")
      },
      {
        channel_id: reactChannel.id,
        user_id: instructor.id,
        message: 'Ótima pergunta! useState é para gerenciar estado local, useEffect é para efeitos colaterais como chamadas de API, subscriptions etc.',
        message_type: 'text',
        created_at: knex.raw("datetime('now', '-1 hour 45 minutes')")
      },
      {
        channel_id: reactChannel.id,
        user_id: students[2].id,
        message: 'Complementando: useEffect roda DEPOIS que o componente renderiza, então é perfeito para operações assíncronas!',
        message_type: 'text',
        created_at: knex.raw("datetime('now', '-1 hour 30 minutes')")
      },
      {
        channel_id: reactChannel.id,
        user_id: students[1].id,
        message: 'Muito obrigado pela explicação! Agora ficou mais claro 😊',
        message_type: 'text',
        created_at: knex.raw("datetime('now', '-1 hour')")
      }
    ]);
  }

  console.log('✅ Dados de exemplo para chat criados com sucesso!');
}
