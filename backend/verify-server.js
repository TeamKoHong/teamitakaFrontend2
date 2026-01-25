const app = require('./src/index');
const http = require('http');

console.log('Starting dry-run verification...');

const server = http.createServer(app);

server.listen(0, () => {
    const address = server.address();
    console.log(`Server started successfully on port ${address.port}`);
    server.close(() => {
        console.log('Server verification passed. Shutting down.');
        process.exit(0);
    });
});

server.on('error', (err) => {
    console.error('Server failed to start:', err);
    process.exit(1);
});
