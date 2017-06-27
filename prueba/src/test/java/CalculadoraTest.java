import com.latam.miprueba.Calculadora;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

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
    public void retornoValor(){
        int valor = 2;
        calc.setValor(2);
        assertSame("No cohinciden los valores",(Integer) calc.getValor(),(Integer) valor);
    }

    @Test
    public void asignarValorTest(){
	    calc.setValor(5);
	    int valor = 5;
	    assertSame("No cohinciden los valores",(Integer) calc.getValor(), (Integer)valor);
    }

    @Test
    public void verificarSuma(){
        int valor= 10;
        calc.setValor(5);
        calc.suma(5);
        assertSame("No cohinciden los valores",(Integer) calc.getValor(),(Integer) valor);
    }

    @Test
    public void verificarRetornoNoNulo(){
        assertNotNull( calc.getValor() );
    }

    @Test
    public void verificarError(){
        assertNotSame(calc.getValor(), RuntimeException.class);
    }
}
