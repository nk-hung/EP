const amqp = require('amqplib');
const message = 'hello, rabbitmq here babe!'

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost');
        const channel = await connection.createChannel()
        
        const queueName = 'topic';

        await channel.assertQueue(queueName, {
            durable: true,
        })

        channel.sendToQueue(queueName, Buffer.from(message))
        console.log(`message producer:: ${message}`)

        
    } catch (error) {
        console.log(error)
    }
}

runProducer().catch(console.error)