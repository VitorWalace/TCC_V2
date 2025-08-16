import db from "../database/connection";
import { User, CreateUserData, UpdateUserData, UserProfile } from "../types";
import { randomUUID } from "crypto";

export class UserModel {
  /**
   * Create a new user
   */
  static async create(userData: CreateUserData): Promise<User> {
    const userId = randomUUID(); // Gerar UUID manualmente para SQLite
    
    const [newUser] = await db("users")
      .insert({
        id: userId,
        email: userData.email.toLowerCase(),
        password: userData.password,
        first_name: userData.first_name,
        last_name: userData.last_name,
        bio: userData.bio || null,
        phone: userData.phone || null,
        role: userData.role || "student",
        is_email_verified: false,
        is_active: true,
      })
      .returning("*");

    return newUser;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    const user = await db("users")
      .where({ email: email.toLowerCase(), is_active: true })
      .first();

    return user || null;
  }

  /**
   * Find user by ID
   */
  static async findById(id: string): Promise<User | null> {
    const user = await db("users")
      .where({ id, is_active: true })
      .first();

    return user || null;
  }

  /**
   * Get user profile (without password)
   */
  static async getProfile(id: string): Promise<UserProfile | null> {
    const user = await db("users")
      .select(
        "id",
        "email",
        "first_name",
        "last_name",
        "bio",
        "avatar_url",
        "phone",
        "role",
        "is_email_verified",
        "created_at",
        "updated_at"
      )
      .where({ id, is_active: true })
      .first();

    return user || null;
  }

  /**
   * Update user profile
   */
  static async updateProfile(id: string, updateData: UpdateUserData): Promise<UserProfile | null> {
    const [updatedUser] = await db("users")
      .where({ id, is_active: true })
      .update({
        ...updateData,
        updated_at: db.fn.now(),
      })
      .returning([
        "id",
        "email",
        "first_name",
        "last_name",
        "bio",
        "avatar_url",
        "phone",
        "role",
        "is_email_verified",
        "is_active",
        "player_class",
        "level",
        "xp_points",
        "created_at",
        "updated_at",
      ]);

    return updatedUser || null;
  }

  /**
   * Update password
   */
  static async updatePassword(id: string, newPasswordHash: string): Promise<boolean> {
    const result = await db("users")
      .where({ id, is_active: true })
      .update({
        password: newPasswordHash,
        updated_at: db.fn.now(),
      });

    return result > 0;
  }

  /**
   * Verify email
   */
  static async verifyEmail(id: string): Promise<boolean> {
    const result = await db("users")
      .where({ id, is_active: true })
      .update({
        is_email_verified: true,
        updated_at: db.fn.now(),
      });

    return result > 0;
  }

  /**
   * Deactivate user (soft delete)
   */
  static async deactivate(id: string): Promise<boolean> {
    const result = await db("users")
      .where({ id })
      .update({
        is_active: false,
        updated_at: db.fn.now(),
      });

    return result > 0;
  }

  /**
   * Get all users (admin only) with pagination
   */
  static async getAll(
    page: number = 1,
    limit: number = 20,
    search?: string
  ): Promise<{
    users: UserProfile[];
    total: number;
    pages: number;
  }> {
    let query = db("users")
      .select(
        "id",
        "email",
        "first_name",
        "last_name",
        "bio",
        "avatar_url",
        "phone",
        "role",
        "is_email_verified",
        "is_active",
        "created_at",
        "updated_at"
      )
      .orderBy("created_at", "desc");

    // Add search functionality
    if (search) {
      query = query.where(function() {
        this.where("first_name", "ilike", `%${search}%`)
          .orWhere("last_name", "ilike", `%${search}%`)
          .orWhere("email", "ilike", `%${search}%`);
      });
    }

    // Get total count for pagination
    const totalQuery = query.clone();
    const countResult = await totalQuery.count("* as count");
    const total = parseInt(countResult[0]?.count as string || "0");

    // Apply pagination
    const offset = (page - 1) * limit;
    const users = await query.limit(limit).offset(offset);

    return {
      users,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Check if email exists
   */
  static async emailExists(email: string, excludeUserId?: string): Promise<boolean> {
    let query = db("users")
      .where({ email: email.toLowerCase(), is_active: true });

    if (excludeUserId) {
      query = query.whereNot("id", excludeUserId);
    }

    const user = await query.first();
    return !!user;
  }

  /**
   * Get users by role
   */
  static async getByRole(role: string): Promise<UserProfile[]> {
    const users = await db("users")
      .select(
        "id",
        "email",
        "first_name",
        "last_name",
        "bio",
        "avatar_url",
        "phone",
        "role",
        "is_email_verified",
        "created_at",
        "updated_at"
      )
      .where({ role, is_active: true })
      .orderBy("created_at", "desc");

    return users;
  }

  /**
   * Get user statistics
   */
  static async getStatistics(): Promise<{
    total: number;
    students: number;
    instructors: number;
    admins: number;
    verified: number;
    active: number;
  }> {
    const [stats] = await db("users")
      .select([
        db.raw("COUNT(*) as total"),
        db.raw("COUNT(CASE WHEN role = 'student' THEN 1 END) as students"),
        db.raw("COUNT(CASE WHEN role = 'instructor' THEN 1 END) as instructors"),
        db.raw("COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins"),
        db.raw("COUNT(CASE WHEN is_email_verified = true THEN 1 END) as verified"),
        db.raw("COUNT(CASE WHEN is_active = true THEN 1 END) as active"),
      ]);

    return {
      total: parseInt(stats.total),
      students: parseInt(stats.students),
      instructors: parseInt(stats.instructors),
      admins: parseInt(stats.admins),
      verified: parseInt(stats.verified),
      active: parseInt(stats.active),
    };
  }
}
