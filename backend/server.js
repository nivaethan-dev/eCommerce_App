import fs from 'fs';
import https from 'https';
import 'dotenv/config'; // automatically loads .env
import connect from './config/dbConnection.js';
import app from './app.js';

const HOST = process.env.HOST;
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

let server;

const startServer = async () => {
  await connect(); // Connect to DB first
  server = app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on ${HOST}:${PORT}`);
  });
};

// =============================================================================
// GRACEFUL SHUTDOWN
// =============================================================================

const SHUTDOWN_TIMEOUT = 10000; // 10 seconds

const gracefulShutdown = (signal) => {
  console.log(`\n[SHUTDOWN] ${signal} received. Shutting down gracefully...`);
  
  if (server) {
    server.close(() => {
      console.log('[SHUTDOWN] HTTP server closed.');
      process.exit(0);
    });
    
    // Force close after timeout if graceful shutdown hangs
    setTimeout(() => {
      console.error('[SHUTDOWN] Forced shutdown after timeout.');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT);
  } else {
    process.exit(0);
  }
};

// Handle termination signals (container deployments, Ctrl+C)
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// =============================================================================
// PROCESS-LEVEL ERROR HANDLERS
// =============================================================================

// Handle uncaught exceptions (synchronous errors that escape try/catch)
process.on('uncaughtException', (error) => {
  console.error('[FATAL] Uncaught Exception:');
  console.error(error);
  
  // In production, exit and let process manager (PM2, Docker, etc.) restart
  // In development, keep running for debugging
  if (isProduction) {
    console.error('[FATAL] Exiting due to uncaught exception...');
    process.exit(1);
  }
});

// Handle unhandled promise rejections (async errors without .catch())
process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Promise Rejection:');
  console.error('Promise:', promise);
  console.error('Reason:', reason);
  
  // In production, exit and let process manager restart
  // In development, keep running for debugging
  if (isProduction) {
    console.error('[FATAL] Exiting due to unhandled rejection...');
    process.exit(1);
  }
});

// =============================================================================
// START SERVER
// =============================================================================

startServer();
