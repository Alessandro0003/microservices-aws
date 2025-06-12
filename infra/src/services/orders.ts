import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import { cluster } from '../cluster';
import { ordersDockerImage } from '../images/orders';
import { rabbitMQAdminHttpListeners } from './rabbitmq';

export const ordersService = new awsx.classic.ecs.FargateService('fargete-orders-app', {
  cluster,
  desiredCount: 1,
  waitForSteadyState: false,
  taskDefinitionArgs: {
    container: {
      image: ordersDockerImage.ref,
      cpu: 256,
      memory: 512,
      environment: [
        {
          name: 'RABBITMQ_URL',
          value: pulumi.interpolate`amqp://admin:rabbitmq_password@${rabbitMQAdminHttpListeners.endpoint.hostname}:${rabbitMQAdminHttpListeners.endpoint.port}`
        }
      ]
    }
  }
})