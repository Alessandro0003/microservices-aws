import * as awsx from "@pulumi/awsx";
import * as pulumi from '@pulumi/pulumi';
import { cluster } from "../cluster";
import { invoicesDockerImage } from "../images/invoices";
import { appLoadBalancer } from "../load-balancer";
import { amqpListeners } from './rabbitmq';

const invoicesTargetGroup = appLoadBalancer.createTargetGroup('invoices-target', {
  port: 3334,
  protocol: 'HTTP',
  healthCheck: {
    path: '/health',
    protocol: 'HTTP',
  }
})

export const invoicesHttpListeners = appLoadBalancer.createListener('invoices-listeners', {
  port: 3334,
  protocol: 'HTTP',
  targetGroup: invoicesTargetGroup
})

export const invoicesService = new awsx.classic.ecs.FargateService('fargate-invoices-app', {
  cluster,
  desiredCount: 1,
  waitForSteadyState: false,
  taskDefinitionArgs: {
    container: {
      image: invoicesDockerImage.ref,
      cpu: 256,
      memory: 512,
      portMappings: [
        invoicesHttpListeners
      ],
      environment: [
        {
          name: 'RABBITMQ_URL',
          value: pulumi.interpolate`amqp://admin:rabbitmq_password@${amqpListeners.endpoint.hostname}:${amqpListeners.endpoint.port}`
        },
        {
          name: 'DATABASE_URL',
          value: 'postgresql://invoices_owner:npg_0ya1EVzGRBpr@ep-round-recipe-a4ne1un5.us-east-1.aws.neon.tech/invoices?sslmode=require'
        },
        {
          name: "OTEL_TRACES_EXPORTER",
          value: "otlp"
        },
        {
          name: "OTEL_EXPORTER_OTLP_ENDPOINT",
          value: "https://otlp-gateway-prod-sa-east-1.grafana.net/otlp"
        },
        {
          name: "OTEL_EXPORTER_OTLP_HEADERS",
          value: "Authorization=Basic MTI4OTAyODpnbGNfZXlKdklqb2lNVFExT0RJM05DSXNJbTRpT2lKbGRtVnVkRzh0Ym05a1pXcHpJaXdpYXlJNkluWTNOa2Q1TTJveWVEUTRNazVTYzFrM1JUVjZkWGc0ZWlJc0ltMGlPbnNpY2lJNkluQnliMlF0YzJFdFpXRnpkQzB4SW4xOQ=="
        },
        {
          name: "OTEL_SERVICE_NAME",
          value: "invoices"
        },
         {
          name: "OTEL_RESOURCE_ATTRIBUTES",
          value: "service.name=my-app,service.namespace=my-application-group,deployment.environment=production"
        },
        {
          name: "OTEL_NODE_RESOURCE_DETECTORS",
          value: "env,host,os"
        },
        {
          name: "OTEL_NODE_ENABLED_INSTRUMENTATION",
          value: "http,fastify,pg,amqplib"
        }
      ]
    }
  }
})