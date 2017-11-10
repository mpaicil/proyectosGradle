package com.slackmag.service;

import lombok.Getter;

@Getter
public class DrawCalculationResponse {
    private String message;

    public DrawCalculationResponse(String message) {
        this.message = message;
    }
}
