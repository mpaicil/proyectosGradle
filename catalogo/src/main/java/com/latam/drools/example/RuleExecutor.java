package com.latam.drools.example;

import com.latam.drools.example.dto.Message;
import org.kie.api.KieServices;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by nxr on 6/20/17.
 */
public class RuleExecutor {

    public static void main(String[] args){
        Logger LOGGER = LoggerFactory.getLogger(RuleExecutor.class);
        LOGGER.info("Iniciando reglas");
        KieServices ks = KieServices.Factory.get();
        KieContainer kContainer = ks.getKieClasspathContainer();

        KieSession kSession = kContainer.newKieSession("ksession1");
        kSession.insert(new Message("Don Raphael", "miercoles poh?"));
        kSession.insert(new Message("Viejo pascuero", "JO JO JO?"));
        LOGGER.debug("Iniciando reglas");
        kSession.fireAllRules();
        LOGGER.debug("Terminando reglas");
    }
}
