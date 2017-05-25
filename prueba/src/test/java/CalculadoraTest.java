import static org.junit.Assert.assertEquals;

import com.latam.miprueba.Calculadora;
import org.junit.Before;
import org.junit.Test;

/**
 * Created by nxr on 5/19/17.
 */

public class CalculadoraTest {
    private Calculadora calc;

    @Before
    public void init(){
        calc = new Calculadora();
    }

    @Test
    public void retornoValor(){
        Integer valor = calc.getValor();
        assertEquals("No cohinciden los valores",(Integer) 0, valor);
    }
}
