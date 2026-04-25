import { io, Socket } from 'socket.io-client'

const REALTIME_URL = process.env.NEXT_PUBLIC_REALTIME_URL || 'http://localhost:3008'

let socket: Socket | null = null

export function getSocket(token: string): Socket {
    if (!socket || !socket.connected) {
        socket = io(REALTIME_URL, {
            auth: { token },
            autoConnect: true,
        })
    }
    return socket
}

export function disconnectSocket(): void {
    if (socket) {
        socket.disconnect()
        socket = null
    }
}