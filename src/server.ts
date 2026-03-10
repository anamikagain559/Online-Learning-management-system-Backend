/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./config/env";
import { seedSuperAdmin } from "./utils/seedSuperAdmin";

import { Server as SocketServer } from "socket.io";
import http from "http";

import { MessageService } from "./modules/message/message.service";

let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)

        console.log("Connected to DB!!");

        const httpServer = http.createServer(app);
        const io = new SocketServer(httpServer, {
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
                    if (mongoose.Types.ObjectId.isValid(sender)) {
                        await MessageService.createMessage({
                            sender,
                            tripId: mongoose.Types.ObjectId.isValid(tripId) ? tripId : undefined,
                            message
                        } as any);
                    }

                    // Broadcast to specific room or globally
                    if (room) {
                        io.to(room).emit("receive_message", data);
                    } else {
                        io.emit("receive_message", data);
                    }
                } catch (err) {
                    console.error("Error saving message:", err);
                    // Still broadcast the message even if saving fails? 
                    // Usually better to let users chat even if DB is glitchy, but with persistence, we want it saved.
                }
            });

            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });

        server = httpServer.listen(envVars.PORT, () => {
            console.log(`Server is listening to port ${envVars.PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

(async () => {
    await startServer()
    await seedSuperAdmin()
})()

process.on("SIGTERM", () => {
    console.log("SIGTERM signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("SIGINT", () => {
    console.log("SIGINT signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})


process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejecttion detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

// Unhandler rejection error
// Promise.reject(new Error("I forgot to catch this promise"))

// Uncaught Exception Error
// throw new Error("I forgot to handle this local erro")


/**
 * unhandled rejection error
 * uncaught rejection error
 * signal termination sigterm
 */
