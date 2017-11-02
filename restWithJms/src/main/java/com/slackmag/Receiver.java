package com.slackmag;

import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import javax.jms.JMSException;

@Component
public class Receiver {

    @JmsListener(destination = "mailbox", containerFactory = "myFactory")
    public void recieveMessage(Email email) {
         System.out.println("Recieved >> " + email);
    }

}
