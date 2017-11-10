package com.slackmag.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DrawRestController {

    @Autowired
    private DrawCalculatorService drawCalculatorService;

    @RequestMapping(value = "/calcular",method = RequestMethod.GET)
    public DrawCalculationResponse calcular(){
        return drawCalculatorService.calculateDraws();
    }

}
