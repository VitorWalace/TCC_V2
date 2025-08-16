import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types";

export class SecurityUtils {
  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare a plain password with a hashed password
   */
  static async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Generate a JWT token
   */
  static generateToken(payload: {
    userId: string;
    email: string;
    role: string;
  }): string {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("JWT_SECRET não está definido nas variáveis de ambiente");
    }

    const options: jwt.SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as string,
      issuer: "saber-em-fluxo-v2",
      audience: "saber-em-fluxo-users",
    };

    return jwt.sign(payload, secretKey, options);
  }

  /**
   * Verify and decode a JWT token
   */
  static verifyToken(token: string): JwtPayload {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("JWT_SECRET não está definido nas variáveis de ambiente");
    }

    try {
      const decoded = jwt.verify(token, secretKey) as JwtPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Token expirado");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Token inválido");
      } else {
        throw new Error("Erro ao verificar token");
      }
    }
  }

  /**
   * Generate a random verification code
   */
  static generateVerificationCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  /**
   * Sanitize user input to prevent XSS
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>'"]/g, "")
      .trim()
      .substring(0, 1000); // Limit length
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static isValidPassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("A senha deve ter pelo menos 8 caracteres");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("A senha deve conter pelo menos uma letra maiúscula");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("A senha deve conter pelo menos uma letra minúscula");
    }
    if (!/\d/.test(password)) {
      errors.push("A senha deve conter pelo menos um número");
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password)) {
      errors.push("A senha deve conter pelo menos um caractere especial");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
