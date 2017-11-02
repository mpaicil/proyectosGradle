package com.latam.miprueba;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Created by nxr on 5/19/17.
 */

public class CalculadoraTest {
    private Calculadora calc;

    @Before
    public void init(){
        calc = new Calculadora();
    }

    @After
    public void clean(){
        calc = null;
    }

    @Test
    public void retornoValor() {
        int valor = 2;
        calc.setValor(2);
        assertSame("No cohinciden los valores",(Integer) calc.getValor(),(Integer) valor);
    }

    @Test
    public void asignarValorTest() {
	    calc.setValor(5);
	    int valor = 5;
	    assertSame("No cohinciden los valores",(Integer) calc.getValor(), (Integer)valor);
    }

    @Test
    public void verificarSuma() {
        int valor= 10;
        calc.setValor(5);
        calc.suma(5);
        assertSame("No cohinciden los valores",(Integer) calc.getValor(),(Integer) valor);
    }

    @Test
    public void verificarRetornoNoNulo() {
        Integer valor = calc.getValor();
        assertSame( valor , 0 );
        assertNotNull( valor );
    }

    @Test
    public void verificarError()  {
        assertNotSame(calc.getValor(), RuntimeException.class);
    }

    @Test
    public void integridadRetturn() {
        Calculadora calculadora = mock(Calculadora.class);

        when(calculadora.getValor()).thenReturn(3);

        assertEquals((Integer) 3 ,(Integer) calculadora.getValor());
    }

    @Test
    public void pruebaNull() {
        Calculadora calculadora = mock(Calculadora.class);

        assertNotNull(calculadora.getValor());
    }
}
