const modelMessage = require('../model/modelMessage');
const userSocketMap = new Map();

function SocketConnection(io) {
    io.on('connection', (socket) => {
        console.log(`Connected: `, socket.id);

        socket.on('handshake', (userId) => {
            if (!userId) return;

            if (!userSocketMap.has(userId)) userSocketMap.set(userId, new Set());
            userSocketMap.get(userId).add(socket.id);
        });

        socket.on('send_message', async (data) => {
            if (!data) return;
            const { sender_id, receiver_id, message, media_url, created_at } = data;
            if (!sender_id || !receiver_id) return;

            const sockets = userSocketMap.get(receiver_id);
            if (sockets) {
                for (const id of sockets) {
                    io.to(id).emit('receive_message', data);
                }
            }

            await modelMessage.StoreMessage(sender_id, receiver_id, message, media_url, created_at);
        });

        socket.on('disconnect', () => {
            for (const [userId, sockets] of userSocketMap.entries()) {
                if (sockets.has(socket.id)) {
                    sockets.delete(socket.id);
                    if (sockets.size === 0) userSocketMap.delete(userId);
                    break;
                }
            }
        });
    });
}

async function SearchUser(userId, page) {
    const pageSize = 10;
    const pageNumber = parseInt(page);
    const validPage = isNaN(pageNumber) || pageNumber <= 1 ? 0 : pageNumber - 1;

    return await modelMessage.Search(userId, validPage, pageSize);
}

async function GetMessage(currUserId, userId, page) {
    const pageSize = 20;
    const pageNumber = parseInt(page);
    const validPage = isNaN(pageNumber) || pageNumber <= 1 ? 0 : pageNumber - 1;

    return await modelMessage.GetMessage(currUserId, userId, validPage, pageSize);
}

module.exports = { SearchUser, GetMessage, SocketConnection };