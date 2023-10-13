const amqp = require('amqplib');

const runConsumer = async() => {
    try {
       const connect = await amqp.connect('amqp://guest:12345@localhost')

       const channel = await connect.createChannel()

       const queueName = 'topic';
       await channel.assertQueue(queueName, {
        durable: true,
       })

       channel.consume(queueName, (messages) => {
        console.log(`Received:: ${messages.content.toString()}`)
       }, {
        noAck: true
       })

    } catch (error) {
       console.log(error) 
    }
}

runConsumer().catch(console.error)