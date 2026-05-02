"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const seedSuperAdmin_1 = require("./utils/seedSuperAdmin");
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const message_service_1 = require("./modules/message/message.service");
let server;
const startServer = async () => {
    try {
        await mongoose_1.default.connect(env_1.envVars.DB_URL);
        console.log("Connected to DB!!");
        const httpServer = http_1.default.createServer(app_1.default);
        const io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        io.on("connection", (socket) => {
            console.log("A user connected:", socket.id);
            // Join a trip-specific room
            socket.on("join_room", (room) => {
                socket.join(room);
                console.log(`User ${socket.id} joined room: ${room}`);
            });
            socket.on("send_message", async (data) => {
                const { sender, tripId, message, room } = data;
                // Save message to database only if sender is a valid ObjectId
                try {
                    if (mongoose_1.default.Types.ObjectId.isValid(sender)) {
                        await message_service_1.MessageService.createMessage({
                            sender,
                            tripId: mongoose_1.default.Types.ObjectId.isValid(tripId) ? tripId : undefined,
                            message
                        });
                    }
                    // Broadcast to specific room or globally
                    if (room) {
                        io.to(room).emit("receive_message", data);
                    }
                    else {
                        io.emit("receive_message", data);
                    }
                }
                catch (err) {
                    console.error("Error saving message:", err);
                    // Still broadcast the message even if saving fails? 
                    // Usually better to let users chat even if DB is glitchy, but with persistence, we want it saved.
                }
            });
            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });
        server = httpServer.listen(env_1.envVars.PORT, () => {
            console.log(`Server is listening to port ${env_1.envVars.PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
};
(async () => {
    await startServer();
    await (0, seedSuperAdmin_1.seedSuperAdmin)();
})();
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received... Server shutting down..");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("SIGINT", () => {
    console.log("SIGINT signal received... Server shutting down..");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection detected... Server shutting down..", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected... Server shutting down..", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// Unhandled rejection error
// Promise.reject(new Error("I forgot to catch this promise"))
// Uncaught Exception Error
// throw new Error("I forgot to handle this local error")
/**
 * unhandled rejection error
 * uncaught rejection error
 * signal termination sigterm
 */
