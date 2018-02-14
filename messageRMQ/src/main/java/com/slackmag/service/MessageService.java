package com.slackmag.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageService {

    @Autowired
    private RabbitTemplate rabbitTemplate;


    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String sendMessageByGet(@RequestParam(value = "mensaje") String message) {
        rabbitTemplate.setExchange("todos");
        rabbitTemplate.convertAndSend(message);
        return "Mensaje Enviado: " + message;
    }

/*
    @RequestMapping(value = "/", method = RequestMethod.POST)
    public String sendMessageByPost(@RequestBody String message) {
        rabbitTemplate.convertAndSend(Config.queueName, message);
        return "Mensaje Enviado";
    }*/

}
