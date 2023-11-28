const amqp = require('amqplib');

const queueName = ''
const runProducerDLX = async (queueName) => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost');
        const channel = await connection.createChannel();

        const notificationExchange = 'notificationEx';
        const notiQueue = 'notificationQueueProcess';
        const notificationExDLX= 'notificationExDLX';
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';

        // 1. create Exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        })

        // 2. create Queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false,  //cho phep cac ket noi truy cap vao cung mot luc hang doi
            durable: true,
            deadLetterExchange: notificationExDLX, // message discarded from the queue will be resent.
            deadLetterRoutingKey: notificationRoutingKeyDLX // 
        })

        // 3. bindQueue
        await channel.bindQueue(queueResult.queue, notificationExchange);
        
        //4. send message
        const msg = 'Mot message';
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            // expiration: '100000',
            persistent: true
        })

        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
        

    } catch (error) {
       console.log(error) 
    }
}

runProducerDLX();