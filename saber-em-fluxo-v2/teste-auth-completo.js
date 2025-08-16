// Teste de cadastro e login para Saber em Fluxo
console.log("🧪 Testando Sistema de Cadastro e Login");
console.log("=====================================");

const axios = require('axios');

const BASE_URL = 'http://localhost:3002';

// Dados de teste
const testUser = {
  firstName: 'João',
  lastName: 'Silva',
  email: 'joao.teste@example.com',
  password: '123456'
};

async function testRegister() {
  console.log('\n1️⃣ Testando CADASTRO...');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
    console.log('✅ Cadastro realizado com sucesso!');
    console.log('📄 Resposta:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.log('❌ Erro no cadastro:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Erro:', error.response.data);
    } else {
      console.log('Erro de conexão:', error.message);
    }
    return null;
  }
}

async function testLogin() {
  console.log('\n2️⃣ Testando LOGIN...');
  
  const loginData = {
    email: testUser.email,
    password: testUser.password
  };

  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
    console.log('✅ Login realizado com sucesso!');
    console.log('📄 Resposta:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.log('❌ Erro no login:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Erro:', error.response.data);
    } else {
      console.log('Erro de conexão:', error.message);
    }
    return null;
  }
}

async function testProfile(token) {
  console.log('\n3️⃣ Testando PERFIL...');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Perfil carregado com sucesso!');
    console.log('📄 Dados do usuário:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.log('❌ Erro ao carregar perfil:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Erro:', error.response.data);
    } else {
      console.log('Erro de conexão:', error.message);
    }
    return null;
  }
}

async function testBackend() {
  console.log('\n🔍 Testando se o backend está ativo...');
  
  try {
    const response = await axios.get(`${BASE_URL}/`);
    console.log('✅ Backend está funcionando!');
    console.log('📄 Resposta:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Backend não está respondendo:');
    console.log('Erro:', error.message);
    console.log('\n💡 Verifique se o backend está rodando na porta 3001');
    return false;
  }
  
  return true;
}

async function runTests() {
  console.log('🚀 Iniciando testes do Saber em Fluxo...\n');

  // Teste se backend está ativo
  const backendActive = await testBackend();
  if (!backendActive) {
    console.log('\n❌ Não é possível continuar os testes sem o backend ativo.');
    return;
  }

  // Teste de cadastro
  const registerResult = await testRegister();
  
  if (registerResult) {
    // Teste de login
    const loginResult = await testLogin();
    
    if (loginResult && loginResult.token) {
      // Teste de perfil
      await testProfile(loginResult.token);
    }
  }

  console.log('\n🎯 Testes concluídos!');
  console.log('=====================================');
  console.log('✅ Sistema de autenticação testado!');
  console.log('🌐 Acesse: http://localhost:5175 para testar na interface');
}

runTests().catch(console.error);
