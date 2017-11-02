package com.slackmag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Sender {

    @Autowired
    private JmsTemplate jmsTemplate;

    @RequestMapping(value = "/send", method = RequestMethod.GET)
    private void sendMessage(@RequestParam(value = "destination", defaultValue = "mailbox") String destination,
                             @RequestParam(value = "to", defaultValue = "info@example.com") String to,
                             @RequestParam(value = "body", defaultValue = "dato") String body) {
        jmsTemplate.convertAndSend(destination, new Email(to, body).toString());
        System.out.println("Sending an email message.");
    }
}
