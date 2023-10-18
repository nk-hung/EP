const amqp = require('amqplib');

const runProducer = async () => {
    try {
       // 1. create connect
       const connection = await amqp.connect('amqp://guest:12345@localhost');

       // 2. create channel 
       const channel = await connection.createChannel();

       // 3. create exchange
       const notiExchange = 'notiExchange 1';
       const notiQueue = 'queue_1'
       const notiExchangeDLX = 'notificationExchangeDLX';
       const notiRoutingKeyDLX = 'notificationRoutingKeyDLX';

       await channel.assertExchange(notiExchange, 'topic', {
        durable: true
       })
    
       // 4. create queue
       const queueResult = channel.assertQueue(notiQueue, {
            exclusive: true,
            deadLetterExchange: notiExchangeDLX,
            deadLetterRoutingKey: notiRoutingKeyDLX,
       })

       // 5. binding queue
       await channel.bindQueue(queueResult.queue, notiExchange)

       // 6. send message
       const msg = 'hehe'
       await channel.sendToQueue(notiExchange, Buffer.from(msg), {
        persistent: true
       })

       // 7. close conn
       setTimeout(() => {
            connection.close();
            process.exit(1)
       }, 500)
    } catch (error) {
       console.error(error) 
    }
}