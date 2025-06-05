import '../rabbitmq/subscriber.ts'

import fastifyCors from '@fastify/cors'
import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from 'fastify-type-provider-zod'

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


app.listen({ host: '0.0.0.0', port: 3334 }).then(() => {
  console.log('[Invoices] HTTP Server running!')
})