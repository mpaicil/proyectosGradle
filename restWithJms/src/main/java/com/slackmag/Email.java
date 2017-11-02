package com.slackmag;

import lombok.Getter;

@Getter
public class Email {

    private String to;
    private String body;

    public Email() {
    }

    public Email(String to, String body) {
        this.to=to;
        this.body=body;
    }

    @Override
    public String toString(){
        return String.format("{_type : hello.Email,to=%s, body=%s}",this.to,this.body);
    }
}
