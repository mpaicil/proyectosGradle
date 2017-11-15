package com.slackmag.service;

import com.slackmag.domain.drawtype.Loto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
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

    @RequestMapping(value = "/calcular2",method = RequestMethod.POST)
    public ResponseEntity< DrawCalculationResponse > calcular2(@RequestBody Loto loto){
        drawCalculatorService.loadAndResponse(loto);
        return ResponseEntity.ok(drawCalculatorService.loadAndResponse(loto));
    }

}
