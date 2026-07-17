import { Server, Socket } from 'socket.io'

export const setupSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id)

    socket.on('join-order', (orderId: string) => {
      socket.join(`order-${orderId}`)
    })

    socket.on('leave-order', (orderId: string) => {
      socket.leave(`order-${orderId}`)
    })

    socket.on('location-update', (data: { orderId: string; latitude: number; longitude: number }) => {
      io.to(`order-${data.orderId}`).emit('delivery-location', {
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: new Date(),
      })
    })

    socket.on('order-status-update', (data: { orderId: string; status: string }) => {
      io.to(`order-${data.orderId}`).emit('order-status-changed', {
        orderId: data.orderId,
        status: data.status,
        timestamp: new Date(),
      })
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })
}
