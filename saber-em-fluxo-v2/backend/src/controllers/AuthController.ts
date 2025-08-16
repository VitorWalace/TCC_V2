import { Request, Response } from "express";
import { UserModel } from "../models/User";
import { SecurityUtils } from "../utils/security";
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  updateProfileSchema,
} from "../utils/validation";
import {
  ApiResponse,
  AuthResponse,
  CreateUserData,
  LoginData,
  UserProfile,
} from "../types";

export class AuthController {
  /**
   * Register a new user
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      console.log("📝 Dados recebidos para registro:", JSON.stringify(req.body, null, 2));
      
      // Validate input data
      const { error, value } = registerSchema.validate(req.body);
      if (error) {
        console.log("❌ Erro de validação:", error.details?.[0]?.message);
        res.status(400).json({
          success: false,
          message: "Dados de entrada inválidos",
          error: error.details?.[0]?.message || "Dados inválidos",
        } as ApiResponse);
        return;
      }

      console.log("✅ Dados validados com sucesso:", JSON.stringify(value, null, 2));

      const userData: CreateUserData = value;

      console.log("🔍 Verificando se email já existe:", userData.email);
      // Check if email already exists
      const existingUser = await UserModel.findByEmail(userData.email);
      if (existingUser) {
        console.log("❌ Email já existe no banco");
        res.status(409).json({
          success: false,
          message: "Este email já está registado",
        } as ApiResponse);
        return;
      }

      console.log("🔐 Fazendo hash da senha...");
      // Hash password
      const hashedPassword = await SecurityUtils.hashPassword(userData.password);
      userData.password = hashedPassword;

      console.log("💾 Criando usuário no banco de dados...");
      // Create user
      const newUser = await UserModel.create(userData);
      console.log("✅ Usuário criado com sucesso:", newUser.id);

      console.log("🔑 Gerando token JWT...");
      // Generate JWT token
      const token = SecurityUtils.generateToken({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      });
      console.log("✅ Token gerado com sucesso");

      console.log("📄 Criando perfil do usuário para resposta...");
      // Return user profile (without password)
      const userProfile: UserProfile = {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        bio: newUser.bio,
        avatar_url: newUser.avatar_url,
        phone: newUser.phone,
        role: newUser.role,
        is_email_verified: newUser.is_email_verified,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
      };

      console.log("✅ Enviando resposta de sucesso para o frontend");
      res.status(201).json({
        success: true,
        message: "Utilizador registado com sucesso",
        data: {
          user: userProfile,
          token,
        } as AuthResponse,
      } as ApiResponse);
    } catch (error) {
      console.error("❌ Erro no registro:", error);
      console.error("❌ Stack trace:", (error as Error)?.stack);
      
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: process.env.NODE_ENV === 'development' ? (error as Error)?.message : undefined
      } as ApiResponse);
    }
  }

  /**
   * Login user
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      console.log("🔐 Dados recebidos para login:", JSON.stringify(req.body, null, 2));
      
      // Validate input data
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        console.log("❌ Erro de validação no login:", error.details?.[0]?.message);
        res.status(400).json({
          success: false,
          message: "Dados de entrada inválidos",
          error: error.details?.[0]?.message || "Dados inválidos",
        } as ApiResponse);
        return;
      }

      console.log("✅ Dados de login validados com sucesso");
      const loginData: LoginData = value;

      console.log("🔍 Procurando usuário por email:", loginData.email);
      // Find user by email
      const user = await UserModel.findByEmail(loginData.email);
      if (!user) {
        console.log("❌ Usuário não encontrado");
        res.status(401).json({
          success: false,
          message: "Email ou senha incorretos",
        } as ApiResponse);
        return;
      }

      console.log("✅ Usuário encontrado:", user.id);
      console.log("🔐 Verificando senha...");
      // Verify password
      const isValidPassword = await SecurityUtils.comparePassword(
        loginData.password,
        user.password
      );

      if (!isValidPassword) {
        console.log("❌ Senha incorreta");
        res.status(401).json({
          success: false,
          message: "Email ou senha incorretos",
        } as ApiResponse);
        return;
      }

      console.log("✅ Senha correta");

      console.log("🔑 Gerando token JWT para login...");
      // Generate JWT token
      const token = SecurityUtils.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });
      console.log("✅ Token de login gerado com sucesso");

      console.log("📄 Criando perfil do usuário para resposta de login...");
      // Return user profile (without password)
      const userProfile: UserProfile = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        bio: user.bio,
        avatar_url: user.avatar_url,
        phone: user.phone,
        role: user.role,
        is_email_verified: user.is_email_verified,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      console.log("✅ Enviando resposta de login bem-sucedido para o frontend");
      res.status(200).json({
        success: true,
        message: "Login realizado com sucesso",
        data: {
          user: userProfile,
          token,
        } as AuthResponse,
      } as ApiResponse);
    } catch (error) {
      console.error("❌ Erro no login:", error);
      console.error("❌ Stack trace:", (error as Error)?.stack);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: process.env.NODE_ENV === 'development' ? (error as Error)?.message : undefined
      } as ApiResponse);
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Utilizador não autenticado",
        } as ApiResponse);
        return;
      }

      const userProfile = await UserModel.getProfile(req.user.userId);
      if (!userProfile) {
        res.status(404).json({
          success: false,
          message: "Utilizador não encontrado",
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: "Perfil obtido com sucesso",
        data: userProfile,
      } as ApiResponse);
    } catch (error) {
      console.error("Erro ao obter perfil:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      } as ApiResponse);
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      console.log("📝 Dados recebidos para atualização de perfil:", JSON.stringify(req.body, null, 2));
      console.log("👤 Usuário autenticado:", req.user?.userId);
      
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Utilizador não autenticado",
        } as ApiResponse);
        return;
      }

      // Validate input data
      const { error, value } = updateProfileSchema.validate(req.body);
      if (error) {
        console.log("❌ Erro de validação na atualização:", error.details?.[0]?.message);
        res.status(400).json({
          success: false,
          message: "Dados de entrada inválidos",
          error: error.details?.[0]?.message || "Dados inválidos",
        } as ApiResponse);
        return;
      }

      console.log("✅ Dados validados com sucesso:", JSON.stringify(value, null, 2));

      // Update profile
      const updatedProfile = await UserModel.updateProfile(req.user.userId, value);
      if (!updatedProfile) {
        console.log("❌ Usuário não encontrado para atualização");
        res.status(404).json({
          success: false,
          message: "Utilizador não encontrado",
        } as ApiResponse);
        return;
      }

      console.log("✅ Perfil atualizado com sucesso:", JSON.stringify(updatedProfile, null, 2));

      res.status(200).json({
        success: true,
        message: "Perfil atualizado com sucesso",
        data: updatedProfile,
      } as ApiResponse);
    } catch (error) {
      console.error("❌ Erro ao atualizar perfil:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      } as ApiResponse);
    }
  }

  /**
   * Change password
   */
  static async changePassword(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Utilizador não autenticado",
        } as ApiResponse);
        return;
      }

      // Validate input data
      const { error, value } = changePasswordSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: "Dados de entrada inválidos",
          error: error.details?.[0]?.message || "Dados inválidos",
        } as ApiResponse);
        return;
      }

      // Get current user
      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: "Utilizador não encontrado",
        } as ApiResponse);
        return;
      }

      // Verify current password
      const isCurrentPasswordValid = await SecurityUtils.comparePassword(
        value.current_password,
        user.password
      );

      if (!isCurrentPasswordValid) {
        res.status(400).json({
          success: false,
          message: "Senha atual incorreta",
        } as ApiResponse);
        return;
      }

      // Hash new password
      const hashedNewPassword = await SecurityUtils.hashPassword(value.new_password);

      // Update password
      const success = await UserModel.updatePassword(req.user.userId, hashedNewPassword);
      if (!success) {
        res.status(500).json({
          success: false,
          message: "Erro ao atualizar senha",
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: "Senha alterada com sucesso",
      } as ApiResponse);
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      } as ApiResponse);
    }
  }

  /**
   * Logout (client-side token removal)
   */
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        message: "Logout realizado com sucesso. Remova o token do cliente.",
      } as ApiResponse);
    } catch (error) {
      console.error("Erro no logout:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      } as ApiResponse);
    }
  }

  /**
   * Verify JWT token
   */
  static async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Token inválido",
        } as ApiResponse);
        return;
      }

      const userProfile = await UserModel.getProfile(req.user.userId);
      if (!userProfile) {
        res.status(404).json({
          success: false,
          message: "Utilizador não encontrado",
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: "Token válido",
        data: userProfile,
      } as ApiResponse);
    } catch (error) {
      console.error("Erro na verificação do token:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      } as ApiResponse);
    }
  }
}
