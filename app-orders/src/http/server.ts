import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from 'fastify-type-provider-zod'
import { z } from 'zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()


app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)


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
}, (request, reply) => {
  const { amount } = request.body

  console.log('Order created with amount:', amount)

  return reply.status(201).send()
})

app.listen({ host: '0.0.0.0', port: 3333 }).then(() => {
  console.log('[Orders] HTTP Server running!')
})