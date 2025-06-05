import '@opentelemetry/auto-instrumentations-node/register'

import fastifyCors from '@fastify/cors'
import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from 'fastify-type-provider-zod'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { db } from '../db/client.ts'
import { schema } from '../db/schemas/index.ts'
import { dispatchOrderCreated } from '../rabbitmq/messages/order-created.ts'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, { origin: '*' })

// Essa rote é usada para verificar se o servidor está funcionando corretamente
app.get('/health', () => {
  return 'Ok'
})

// Escalonamento horizontal
// Deploy: Blue-green deployment

app.post('/orders', {
  schema: {
    body: z.object({
      amount: z.coerce.number(),
    })
  },
}, async (request, reply) => {
  const { amount } = request.body

  console.log('Order created with amount:', amount)

  const orderId = randomUUID()

  await dispatchOrderCreated({
    orderId,
    amount,
    customer: {
      id: '123e4567-e89b-12d3-a456-426614174000', // Exemplo de ID de cliente
    }
  })

  await db.insert(schema.orders).values({
    id: orderId,
    customerId: '123e4567-e89b-12d3-a456-426614174000',
    amount,
  })

  return reply.status(201).send()
})

app.listen({ host: '0.0.0.0', port: 3333 }).then(() => {
  console.log('[Orders] HTTP Server running!')
})