@EventPattern('test.request.topic')
handle(@Payload() msg: any, @Ctx() ctx: KafkaContext) {
  const { replyTopic, correlationId, payload } = msg;

  const result = { transformed: 'DONE', session: payload.header?.session };

  ctx.getProducer().send({
    topic: replyTopic,
    messages: [{ key: correlationId, value: JSON.stringify(result) }],
  });
}