const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'kafkaMQ',
    brokers: ['192.168.2.2:9092']
})

const runConsumer = async () => {
    const consumer =  kafka.consumer({ groupId: 'test-topic'});
    await consumer.connect()
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({value: message.value.toString()
            })
        }
    })
}

runConsumer()