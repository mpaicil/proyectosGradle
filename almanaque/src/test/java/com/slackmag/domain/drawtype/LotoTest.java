package com.slackmag.domain.drawtype;

import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertThat;

public class LotoTest {

    private Loto loto;

    private Integer firstNumber = 2;
    private Integer secondNumber = 34;
    private Integer thirdNumber = 12;
    private Integer fourthNumber = 41;
    private Integer fifthNumber = 4;
    private Integer sixthNumber = 13;

    private Integer joker = 37;

    @Before
    public void setup() {
        Integer[] listNumber = new Integer[6];
        listNumber[0] = firstNumber;
        listNumber[1] = secondNumber;
        listNumber[2] = thirdNumber;
        listNumber[3] = fourthNumber;
        listNumber[4] = fifthNumber;
        listNumber[5] = sixthNumber;

        loto = new Loto(listNumber, joker);
    }

    @Test
    public void verifyTheCorrectReturnOfTheFirstNumber() {
        Integer testNumber = loto.getFirstNumber();

        assertThat(testNumber, equalTo(firstNumber));
    }

    @Test
    public void verifyTheCorrectReturnOfTheSecondNumber() {
        Integer testNumber = loto.getSecondNumber();

        assertThat(testNumber, equalTo(secondNumber));
    }

    @Test
    public void verifyTheCorrectReturnOfTheThirdNumber() {
        Integer testNumber = loto.getThirdNumber();

        assertThat(testNumber, equalTo(thirdNumber));
    }

    @Test
    public void verifyTheCorrectReturnOfTheFourthNumber() {
        Integer testNumber = loto.getFourthNumber();

        assertThat(testNumber, equalTo(fourthNumber));
    }

    @Test
    public void verifyTheCorrectReturnOfTheFifthNumber() {
        Integer testNumber = loto.getFifthNumber();

        assertThat(testNumber, equalTo(fifthNumber));
    }

    @Test
    public void verifyTheCorrectReturnOfTheSixthNumber() {
        Integer testNumber = loto.getSixthNumber();

        assertThat(testNumber, equalTo(sixthNumber));
    }

    @Test
    public void verifyTheCorrectReturnOfTheJokerNumber() {
        Integer testNumber = loto.getJokerNumber();

        assertThat(testNumber, equalTo(joker));
    }
}