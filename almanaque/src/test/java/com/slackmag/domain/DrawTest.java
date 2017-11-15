package com.slackmag.domain;

import com.slackmag.domain.drawtype.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.util.List;

import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class DrawTest {

    private Draw draw;

    private static final Integer DRAW_ID = 4094;

    private LocalDate date = LocalDate.of(2017,11,12);

    @Mock
    private Loto loto;

    @Mock
    private Revancha revancha;

    @Mock
    private Desquite desquite;

    @Mock
    private AhoraSi ahoraSi;

    @Mock
    private List<Jubilazo> jubilazos;

    @Mock
    private Multiplicador multiplicador;

    @Before
    public void setup(){
        draw = new Draw(DRAW_ID,date,loto,revancha,desquite,ahoraSi,jubilazos,multiplicador);
    }

    @Test
    public void verifyTheDateOfTheDraw() throws DateTimeException{
        LocalDate testDate = draw.getDate();
        assertThat(testDate, equalTo(date));
    }

    @Test
    public void verifyTheDrawId(){
        Integer id = draw.getDrawId();
        assertThat(id,equalTo(DRAW_ID));
    }

    @Test
    public void verifyTheFifthNumberOfTheLoto(){
        when(loto.getFifthNumber()).thenReturn(23);

        Integer testNumber = draw.getLoto().getFifthNumber();
        assertThat(testNumber,equalTo(23));
    }

    @Test
    public void verifyTheJokerNumberOfLoto(){
        when(loto.getJokerNumber()).thenReturn(37);

        Integer testNumber = draw.getLoto().getJokerNumber();
        assertThat(testNumber,equalTo(37));
    }

}
