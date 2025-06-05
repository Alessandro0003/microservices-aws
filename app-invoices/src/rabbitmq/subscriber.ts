import { orders } from "./channels/order.ts";

// !TODO: acknowledge => reconhecer a mensagem
orders.consume('orders', async message => {
  console.log(message?.content.toString())

  orders.ack(message!);
}, {
  noAck: false,
})