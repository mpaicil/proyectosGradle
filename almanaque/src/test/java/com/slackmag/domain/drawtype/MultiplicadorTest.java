package com.slackmag.domain.drawtype;

import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertThat;

public class MultiplicadorTest {

    private static final Integer VALUE = 4;

    private Multiplicador multiplicador;

    @Before
    public void setup(){
        multiplicador = new Multiplicador(VALUE);
    }

    @Test
    public void verifyTheCorrectReturnOfTheNumber(){
        Integer testNumber = multiplicador.getNumber();

        assertThat( testNumber , equalTo(VALUE));
    }

}
