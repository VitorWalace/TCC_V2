// Teste simples da API
const testAPI = async () => {
  try {
    console.log('🚀 Testando API...');
    const response = await fetch('http://localhost:5000/api/courses');
    const data = await response.json();
    console.log('✅ Resposta da API:', data);
    console.log('📊 Número de cursos:', data.data?.length || 0);
    
    if (data.data && data.data.length > 0) {
      console.log('🎯 Primeiro curso:', data.data[0]);
    }
  } catch (error) {
    console.error('❌ Erro na API:', error);
  }
};

testAPI();
