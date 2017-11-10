package com.slackmag;

import lombok.Getter;

@Getter
public class Greeting {

    private final long id;
    private final String message;

    public Greeting(long id, String message) {
        this.id = id;
        this.message = message;
    }
}
