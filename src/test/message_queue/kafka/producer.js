const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'kafkaMQ',
    brokers: ['192.168.2.2:9092']
})

const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })

const runProducer = async () => {
    await producer.connect()
    await producer.send({
        topic: 'test-topic',
        messages: [
            {value: 'Hello Kafka, i`m here '}
        ]
    })

    await producer.disconnect()
}

runProducer().catch(console.error)