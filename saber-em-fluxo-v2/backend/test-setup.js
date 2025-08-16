// Teste simples para verificar a configuração
const knex = require('knex');
const config = require('./knexfile.js');

async function testSetup() {
  console.log('🚀 Testando configuração...');
  
  try {
    const db = knex(config.development);
    
    console.log('✅ Conexão com banco SQLite criada');
    
    // Testar se consegue conectar
    await db.raw('SELECT 1');
    console.log('✅ Conexão testada com sucesso');
    
    // Verificar se as tabelas existem
    const hasUsersTable = await db.schema.hasTable('users');
    console.log('📊 Tabela users existe:', hasUsersTable);
    
    if (!hasUsersTable) {
      console.log('🔄 Executando migrações...');
      await db.migrate.latest();
      console.log('✅ Migrações executadas');
    }
    
    // Contar usuários
    const userCount = await db('users').count('id as count').first();
    console.log('👥 Total de usuários:', userCount.count);
    
    await db.destroy();
    console.log('🎉 Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testSetup();
