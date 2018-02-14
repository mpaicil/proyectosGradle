package com.slackmag.dependency.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TickerResponse {
    public Ticker ticker;
}
