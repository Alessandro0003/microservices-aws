import ampq from 'amqplib';

if (!process.env.RABBITMQ_URL) {
  throw new Error('RABBITMQ_URL environment variable is not set');
}

export const broker = await ampq.connect(process.env.RABBITMQ_URL)