import * as awsx from '@pulumi/awsx';
import { cluster } from '../cluster';
import { appLoadBalancer, networkLoadBalancer } from '../load-balancer';

const rabbitMQAdminTargetGroup = appLoadBalancer.createTargetGroup('rabbitmq-admin-target', {
  port: 15672,
  protocol: 'HTTP',
  healthCheck: {
    path: '/',
    protocol: 'HTTP',
  }
})

export const rabbitMQAdminHttpListeners = appLoadBalancer.createListener('rabbitmq-admin-listeners', {
  port: 15672,
  protocol: 'HTTP',
  targetGroup: rabbitMQAdminTargetGroup
})

export const amqpTargetGroup = networkLoadBalancer.createTargetGroup('amqp-target', {
  protocol: 'TCP',
  port: 5672,
  targetType: 'ip',
  healthCheck: {
    protocol: 'TCP',
    port: '5672',
  },
})

export const amqpListeners = networkLoadBalancer.createListener('amqp-listeners', {
  port: 5672,
  protocol: 'TCP',
  targetGroup: amqpTargetGroup
})

export const rabbitMQService = new awsx.classic.ecs.FargateService('fargete-rabbitmq-app', {
  cluster,
  desiredCount: 1,
  waitForSteadyState: false,
  taskDefinitionArgs: {
    container: {
      image: 'rabbitmq:3-management',
      cpu: 256,
      memory: 512,
      portMappings: [
        rabbitMQAdminHttpListeners,
        amqpListeners
      ],
      environment: [
        { name: 'RABBITMQ_DEFAULT_USER', value: 'admin' },
        // { name: 'RABBITMQ_DEFAULT_PASS', value:  pulumi.secret('rabbitmq_password') }, // Uncomment if using Pulumi secrets
        
        // Alternatively, use a secret management solution to manage sensitive data
        { name: 'RABBITMQ_DEFAULT_PASS', value: 'rabbitmq_password' }, // Replace with your secret management solution
      ],  
    },
  },
})