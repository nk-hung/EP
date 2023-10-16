const amqp = require('amqplib');

const queueName = ''
const runProducerDLX = async (queueName) => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost');
        const channel = connection.createChannel();

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
            exclusive: true,  //cho phep cac ket noi tuy cap vao cung mot luc hang doi
            // durable: true,
            deadLetterExchange: notificationExDLX, // message discarded from the queue will be resent.
            deadLetterRoutingKey: notificationRoutingKeyDLX // 
        })

        // 3. bindQueue
        await channel.bindQueue(queueResult.queue, notificationExchange);
        
        //4. send message
        const msg = 'Send 1 message de test';
        await channel.sendToQueue(queueName.queue, Buffer.from(msg), {
            expiration: '10000'
        })
        

    } catch (error) {
       console.log(error) 
    }
}