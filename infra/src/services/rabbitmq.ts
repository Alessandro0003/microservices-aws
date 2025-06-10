import * as awsx from '@pulumi/awsx';
import { cluster } from '../cluster';

export const rabbitMQService = new awsx.classic.ecs.FargateService('fargete-rabbitmq', {
  cluster,
  desiredCount: 1,
  waitForSteadyState: false,
  taskDefinitionArgs: {
    container: {
      image: 'rabbitmq:3-management',
      cpu: 256,
      memory: 512,
      environment: [
        { name: 'RABBITMQ_DEFAULT_USER', value: 'admin' },
        // { name: 'RABBITMQ_DEFAULT_PASS', value:  pulumi.secret('rabbitmq_password') }, // Uncomment if using Pulumi secrets
        
        // Alternatively, use a secret management solution to manage sensitive data
        { name: 'RABBITMQ_DEFAULT_PASS', value: 'rabbitmq_password' }, // Replace with your secret management solution
      ],  
    },
  },
})