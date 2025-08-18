import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

// Routes imports
import authRoutes from "./routes/auth";
import chatRoutes from "./routes/chat_new";
import courseRoutes from "./routes/courses";
import gameRoutes from "./routes/game";
// import userRoutes from "./routes/users";

// Load environment variables
dotenv.config();

class App {
  public app: Application;
  public server;
  public io: SocketIOServer;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: [
          "http://localhost:5173",
          "http://localhost:5175",
          "http://localhost:5176",
          "http://localhost:5180",
          "http://localhost:5181",
          "http://localhost:5186",
          "http://localhost:5187",
          "http://localhost:5188",
          "http://localhost:5189",
          process.env.SOCKET_CORS_ORIGIN || "http://localhost:5176"
        ],
        methods: ["GET", "POST"],
      },
    });

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeSocketIO();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS configuration
    this.app.use(
      cors({
        origin: [
          "http://localhost:5173",
          "http://localhost:5175",
          "http://localhost:5176",
          "http://localhost:5180",
          "http://localhost:5181",
          "http://localhost:5186",
          "http://localhost:5187",
          "http://localhost:5188",
          "http://localhost:5189",
          "http://localhost:5190",
          "http://localhost:5191",
          process.env.SOCKET_CORS_ORIGIN || "http://localhost:5176"
        ],
        credentials: true,
      })
    );

    // Rate limiting
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"), // limit each IP to 100 requests per windowMs
      message: "Muitas tentativas. Tente novamente mais tarde.",
    });
    this.app.use(limiter);

    // Body parser middleware
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get("/api/health", (req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        message: "Saber em Fluxo API está funcionando!",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        cors_allowed: ["http://localhost:5173", "http://localhost:5175", "http://localhost:5176", "http://localhost:5186", "http://localhost:5187", "http://localhost:5188", "http://localhost:5190"]
      });
    });

    // Root endpoint
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        message: "🚀 Saber em Fluxo Backend - API funcionando!",
        version: "1.0.0",
        endpoints: {
          health: "/api/health",
          auth: "/api/auth/*",
          courses: "/api/courses/*",
          game: "/api/game/*",
          chat: "/api/chat/*"
        }
      });
    });

    // API routes
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/chat", chatRoutes);
    this.app.use("/api/courses", courseRoutes);
    this.app.use("/api/game", gameRoutes);
    // this.app.use("/api/users", userRoutes);

    // 404 handler
    this.app.use("*", (req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        message: "Endpoint não encontrado",
      });
    });
  }

  private initializeErrorHandling(): void {
    // Global error handler
    this.app.use(
      (error: Error, req: Request, res: Response, next: NextFunction) => {
        console.error("❌ Erro no servidor:", error);

        // Development vs Production error responses
        if (process.env.NODE_ENV === "development") {
          res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error: error.message,
            stack: error.stack,
          });
        } else {
          res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
          });
        }
      }
    );
  }

  private initializeSocketIO(): void {
    this.io.on("connection", (socket) => {
      console.log(`🔌 Novo cliente conectado: ${socket.id}`);

      socket.on("disconnect", () => {
        console.log(`🔌 Cliente desconectado: ${socket.id}`);
      });

      // Socket events will be handled here
      // socket.on("join_chat", (data) => { ... });
    });
  }

  public listen(): void {
    const PORT = process.env.PORT || 5000;
    const HOST = process.env.HOST || "localhost";

    this.server.listen(PORT, () => {
      console.log("🚀 Saber em Fluxo v2.0 Backend iniciado!");
      console.log(`📡 Servidor rodando em: http://${HOST}:${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔌 Socket.IO configurado para: ${process.env.SOCKET_CORS_ORIGIN}`);
    });
  }
}

export default App;
