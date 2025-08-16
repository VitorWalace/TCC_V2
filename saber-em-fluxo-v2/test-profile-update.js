// Test Profile Update
const testUpdateProfile = async () => {
  try {
    console.log("🧪 Testando atualização de perfil...")
    
    const loginResponse = await fetch('http://localhost:4001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'instructor@saberemfluxo.com',
        password: 'password'
      })
    })

    const loginData = await loginResponse.json()
    
    if (!loginData.success) {
      console.error('❌ Erro no login:', loginData.message)
      return
    }

    const token = loginData.data.token
    console.log("✅ Login realizado com sucesso")
    
    // Test profile update
    const updateResponse = await fetch('http://localhost:4001/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        first_name: 'João',
        last_name: 'Professor',
        bio: 'Instrutor apaixonado por ensinar programação e gamificação. Especialista em React, Node.js e desenvolvimento full-stack. Transformando o aprendizado em uma aventura épica! 🎮⚔️'
      })
    })

    const updateData = await updateResponse.json()
    console.log("📊 Resposta da atualização:", JSON.stringify(updateData, null, 2))
    
    if (updateData.success) {
      console.log("✅ Perfil atualizado com sucesso!")
      console.log("📋 Biografia atualizada:", updateData.data.bio)
    } else {
      console.error("❌ Erro na atualização:", updateData.message)
    }

  } catch (error) {
    console.error("❌ Erro no teste:", error)
  }
}

// Execute the test
testUpdateProfile()
