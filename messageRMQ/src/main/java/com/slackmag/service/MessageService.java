package com.slackmag.service;

import com.slackmag.config.Config;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class MessageService {

    @Autowired
    private RabbitTemplate rabbitTemplate;


    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String sendMessageByGet(@RequestParam(value = "mensaje") String message) {
        
        rabbitTemplate.convertAndSend(Config.queueName, message);
        return "Mensaje Enviado";
    }

/*
    @RequestMapping(value = "/", method = RequestMethod.POST)
    public String sendMessageByPost(@RequestBody String message) {
        rabbitTemplate.convertAndSend(Config.queueName, message);
        return "Mensaje Enviado";
    }*/

}
