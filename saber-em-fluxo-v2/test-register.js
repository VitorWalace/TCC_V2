// Teste rápido de registro de usuário
const testRegistration = async () => {
  try {
    console.log('🚀 Testando registro na nova porta...')
    
    const response = await fetch('http://localhost:4001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'vitor123@gmail.com',
        password: 'Vitorwalace123!',
        first_name: 'Vitor',
        last_name: 'Walace'
      })
    })
    
    const data = await response.json()
    console.log('Status:', response.status)
    console.log('Response:', data)
    
    if (response.ok) {
      console.log('✅ Registro funcionou! Agora teste no navegador: http://localhost:5189/register')
    } else {
      console.log('❌ Erro no registro:', data.message)
    }
  } catch (error) {
    console.error('❌ Erro de rede:', error.message)
    console.log('Verifique se o backend está rodando na porta 4001')
  }
}

// Execute o teste
testRegistration()
