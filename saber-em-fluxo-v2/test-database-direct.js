// Teste direto do banco de dados
const knex = require('knex');
const config = require('./backend/knexfile.js');

const db = knex(config.development);

const testDatabase = async () => {
  try {
    console.log('🚀 Conectando ao banco de dados...');
    
    // Verificar se a tabela de cursos existe
    const hasCoursesTable = await db.schema.hasTable('courses');
    console.log('📋 Tabela courses existe:', hasCoursesTable);
    
    if (hasCoursesTable) {
      // Contar cursos
      const count = await db('courses').count('* as total').first();
      console.log('📊 Total de cursos no banco:', count.total);
      
      // Buscar alguns cursos
      const courses = await db('courses').select('id', 'title', 'category', 'difficulty').limit(5);
      console.log('🎯 Primeiros 5 cursos:', courses);
    }
    
  } catch (error) {
    console.error('❌ Erro no banco:', error);
  } finally {
    await db.destroy();
  }
};

testDatabase();
