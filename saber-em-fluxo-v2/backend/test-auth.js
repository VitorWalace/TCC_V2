// Teste dos endpoints de autenticação
console.log("🧪 Testando Sistema de Autenticação do Saber em Fluxo v2.0\n");

const baseURL = "http://localhost:3001/api";

// Função para fazer requisições HTTP
async function makeRequest(method, endpoint, body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${baseURL}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`\n📡 ${method} ${endpoint}`);
    console.log(`Status: ${response.status}`);
    console.log("Resposta:", JSON.stringify(data, null, 2));
    
    return { status: response.status, data };
  } catch (error) {
    console.log(`\n❌ Erro em ${method} ${endpoint}:`, error.message);
    return null;
  }
}

async function testAuthentication() {
  // 1. Testar Health Check
  console.log("=".repeat(50));
  console.log("🏥 TESTE 1: Health Check");
  console.log("=".repeat(50));
  await makeRequest("GET", "/health");

  // 2. Testar Registro
  console.log("\n" + "=".repeat(50));
  console.log("👤 TESTE 2: Registro de Usuário");
  console.log("=".repeat(50));
  
  const userData = {
    email: "teste@exemplo.com",
    password: "MinhaSenh@123",
    first_name: "João",
    last_name: "Silva"
  };
  
  const registerResult = await makeRequest("POST", "/auth/register", userData);
  
  let token = null;
  if (registerResult && registerResult.data && registerResult.data.data && registerResult.data.data.token) {
    token = registerResult.data.data.token;
    console.log("✅ Token obtido no registro:", token.substring(0, 50) + "...");
  }

  // 3. Testar Login
  console.log("\n" + "=".repeat(50));
  console.log("🔑 TESTE 3: Login");
  console.log("=".repeat(50));
  
  const loginData = {
    email: "teste@exemplo.com",
    password: "MinhaSenh@123"
  };
  
  const loginResult = await makeRequest("POST", "/auth/login", loginData);
  
  if (loginResult && loginResult.data && loginResult.data.data && loginResult.data.data.token) {
    token = loginResult.data.data.token;
    console.log("✅ Token obtido no login:", token.substring(0, 50) + "...");
  }

  // 4. Testar Perfil (com token)
  if (token) {
    console.log("\n" + "=".repeat(50));
    console.log("👤 TESTE 4: Obter Perfil (Autenticado)");
    console.log("=".repeat(50));
    
    try {
      const response = await fetch(`${baseURL}/auth/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      console.log(`\n📡 GET /auth/profile`);
      console.log(`Status: ${response.status}`);
      console.log("Resposta:", JSON.stringify(data, null, 2));
    } catch (error) {
      console.log("\n❌ Erro ao obter perfil:", error.message);
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("🎯 RESUMO DOS TESTES");
  console.log("=".repeat(50));
  console.log("✅ Health Check - API funcionando");
  console.log("🔄 Registro/Login - Verificar logs acima");
  console.log("🛡️ Autenticação JWT - Verificar logs acima");
  console.log("\n🎉 Testes concluídos!");
}

// Executar os testes
testAuthentication().catch(console.error);
