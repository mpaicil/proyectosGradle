package com.slackmag.services;

import com.slackmag.dependency.domain.TickerResponse;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class InfoService {

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public TickerResponse getInfo() {
        RestTemplate restTemplate = new RestTemplate();

        TickerResponse tickerResponse = restTemplate.getForObject("https://www.buda.com/api/v2/markets/eth-clp/ticker.json", TickerResponse.class);
        return tickerResponse;
    }
}
