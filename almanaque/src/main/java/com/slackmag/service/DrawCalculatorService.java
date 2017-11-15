package com.slackmag.service;

import com.slackmag.domain.Sorteo;
import com.slackmag.domain.drawtype.Loto;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DrawCalculatorService {

    @Autowired
    private KieContainer kContainer;

    public DrawCalculationResponse calculateDraws() {
        Map<String, List<Sorteo>> prueba = new HashMap<String, List<Sorteo>>();
        KieSession kieSession = kContainer.newKieSession();
        kieSession.setGlobal("mapa", prueba);
        kieSession.insert(new ArrayList<Sorteo>());
        kieSession.fireAllRules();
        kieSession.dispose();

        String messageResponse = "El tamanho es " + (prueba.get("cero")).size();
        DrawCalculationResponse dcr = new DrawCalculationResponse(messageResponse);
        return dcr;
    }

    public DrawCalculationResponse loadAndResponse(Loto loto) {
        System.out.println(loto);

        String messageResponse = "El loto fue cargado con exito";
        System.out.print(messageResponse);
        return (new DrawCalculationResponse(messageResponse));
    }
}
