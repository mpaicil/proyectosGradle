package com.slackmag.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Config {

    public final static String queueName = "spring-boot5";

    @Bean
    Queue queue() {
        return new Queue(queueName, true);
    }
    /*
    @Bean
    FanoutExchange exchange() {
        return new FanoutExchange("spring-boot-exchange4");
    }

    @Bean
    Binding binding(Queue queue, FanoutExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange);
    }

    @Bean
    SimpleMessageListenerContainer container(ConnectionFactory connectionFactory) {

        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.setQueues(queue());


        return container;
    }*/


}
