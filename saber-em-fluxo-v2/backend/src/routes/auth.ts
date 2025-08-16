import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", AuthController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", AuthController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Public
 */
router.post("/logout", AuthController.logout);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/profile", authenticateToken, AuthController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put("/profile", authenticateToken, AuthController.updateProfile);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put("/change-password", authenticateToken, AuthController.changePassword);

/**
 * @route   GET /api/auth/verify-token
 * @desc    Verify JWT token validity
 * @access  Private
 */
router.get("/verify-token", authenticateToken, AuthController.verifyToken);

export default router;
