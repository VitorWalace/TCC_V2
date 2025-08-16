import Joi from "joi";

// User Registration Validation Schema
export const registerSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .max(255)
    .messages({
      "string.email": "Email deve ter um formato válido",
      "string.empty": "Email é obrigatório",
      "string.max": "Email deve ter no máximo 255 caracteres",
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9])"))
    .required()
    .messages({
      "string.min": "A senha deve ter pelo menos 8 caracteres",
      "string.max": "A senha deve ter no máximo 128 caracteres",
      "string.pattern.base": "A senha deve conter pelo menos: 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial",
      "string.empty": "Senha é obrigatória",
    }),

  first_name: Joi.string()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
    .required()
    .messages({
      "string.min": "Nome deve ter pelo menos 2 caracteres",
      "string.max": "Nome deve ter no máximo 100 caracteres",
      "string.pattern.base": "Nome deve conter apenas letras e espaços",
      "string.empty": "Nome é obrigatório",
    }),

  last_name: Joi.string()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
    .required()
    .messages({
      "string.min": "Sobrenome deve ter pelo menos 2 caracteres",
      "string.max": "Sobrenome deve ter no máximo 100 caracteres",
      "string.pattern.base": "Sobrenome deve conter apenas letras e espaços",
      "string.empty": "Sobrenome é obrigatório",
    }),

  bio: Joi.string()
    .max(1000)
    .allow("")
    .optional()
    .messages({
      "string.max": "Bio deve ter no máximo 1000 caracteres",
    }),

  phone: Joi.string()
    .pattern(/^[+]?[\d\s\-()]{10,20}$/)
    .allow("")
    .optional()
    .messages({
      "string.pattern.base": "Telefone deve ter um formato válido",
    }),

  role: Joi.string()
    .valid("student", "instructor")
    .default("student")
    .optional()
    .messages({
      "any.only": "Role deve ser 'student' ou 'instructor'",
    }),
});

// User Login Validation Schema
export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .max(255)
    .messages({
      "string.email": "Email deve ter um formato válido",
      "string.empty": "Email é obrigatório",
      "string.max": "Email deve ter no máximo 255 caracteres",
    }),

  password: Joi.string()
    .min(1)
    .max(128)
    .required()
    .messages({
      "string.empty": "Senha é obrigatória",
      "string.max": "Senha deve ter no máximo 128 caracteres",
    }),
});

// User Profile Update Validation Schema
export const updateProfileSchema = Joi.object({
  first_name: Joi.string()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
    .optional()
    .messages({
      "string.min": "Nome deve ter pelo menos 2 caracteres",
      "string.max": "Nome deve ter no máximo 100 caracteres",
      "string.pattern.base": "Nome deve conter apenas letras e espaços",
    }),

  last_name: Joi.string()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
    .optional()
    .messages({
      "string.min": "Sobrenome deve ter pelo menos 2 caracteres",
      "string.max": "Sobrenome deve ter no máximo 100 caracteres",
      "string.pattern.base": "Sobrenome deve conter apenas letras e espaços",
    }),

  bio: Joi.string()
    .max(1000)
    .allow("")
    .optional()
    .messages({
      "string.max": "Bio deve ter no máximo 1000 caracteres",
    }),

  phone: Joi.string()
    .pattern(/^[+]?[\d\s\-()]{10,20}$/)
    .allow("")
    .optional()
    .messages({
      "string.pattern.base": "Telefone deve ter um formato válido",
    }),

  avatar_url: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .max(500)
    .allow("")
    .optional()
    .messages({
      "string.uri": "Avatar URL deve ser um link válido",
      "string.max": "Avatar URL deve ter no máximo 500 caracteres",
    }),
});

// Password Change Validation Schema
export const changePasswordSchema = Joi.object({
  current_password: Joi.string()
    .min(1)
    .required()
    .messages({
      "string.empty": "Senha atual é obrigatória",
    }),

  new_password: Joi.string()
    .min(8)
    .max(128)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]"))
    .required()
    .messages({
      "string.min": "A nova senha deve ter pelo menos 8 caracteres",
      "string.max": "A nova senha deve ter no máximo 128 caracteres",
      "string.pattern.base": "A nova senha deve conter pelo menos: 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial",
      "string.empty": "Nova senha é obrigatória",
    }),

  confirm_password: Joi.string()
    .valid(Joi.ref("new_password"))
    .required()
    .messages({
      "any.only": "Confirmação de senha deve ser igual à nova senha",
      "string.empty": "Confirmação de senha é obrigatória",
    }),
});

// Email Verification Schema
export const emailVerificationSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .max(255)
    .messages({
      "string.email": "Email deve ter um formato válido",
      "string.empty": "Email é obrigatório",
    }),

  verification_code: Joi.string()
    .length(6)
    .pattern(/^[A-Z0-9]+$/)
    .required()
    .messages({
      "string.length": "Código de verificação deve ter 6 caracteres",
      "string.pattern.base": "Código de verificação deve conter apenas letras maiúsculas e números",
      "string.empty": "Código de verificação é obrigatório",
    }),
});

// Password Reset Request Schema
export const passwordResetRequestSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .max(255)
    .messages({
      "string.email": "Email deve ter um formato válido",
      "string.empty": "Email é obrigatório",
    }),
});

// Password Reset Schema
export const passwordResetSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .max(255)
    .messages({
      "string.email": "Email deve ter um formato válido",
      "string.empty": "Email é obrigatório",
    }),

  reset_code: Joi.string()
    .length(6)
    .pattern(/^[A-Z0-9]+$/)
    .required()
    .messages({
      "string.length": "Código de recuperação deve ter 6 caracteres",
      "string.pattern.base": "Código de recuperação deve conter apenas letras maiúsculas e números",
      "string.empty": "Código de recuperação é obrigatório",
    }),

  new_password: Joi.string()
    .min(8)
    .max(128)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]"))
    .required()
    .messages({
      "string.min": "A nova senha deve ter pelo menos 8 caracteres",
      "string.max": "A nova senha deve ter no máximo 128 caracteres",
      "string.pattern.base": "A nova senha deve conter pelo menos: 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial",
      "string.empty": "Nova senha é obrigatória",
    }),
});
