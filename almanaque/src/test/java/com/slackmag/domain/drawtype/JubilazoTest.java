package com.slackmag.domain.drawtype;

import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertThat;

public class JubilazoTest {

    private Integer firstNumber = 2;
    private Integer secondNumber = 3;
    private Integer thirdNumber = 11;
    private Integer fourthNumber = 21;
    private Integer fifthNumber = 4;
    private Integer sixthNumber = 13;

    private Jubilazo jubilazo;

    @Before
    public void setup() {
        Integer[] listNumber = new Integer[6];
        listNumber[0] = firstNumber;
        listNumber[1] = secondNumber;
        listNumber[2] = thirdNumber;
        listNumber[3] = fourthNumber;
        listNumber[4] = fifthNumber;
        listNumber[5] = sixthNumber;

        jubilazo = new Jubilazo(listNumber);
    }
    
    @Test
    public void verifyTheCorrectReturnOfTheFirstNumber() {
        Integer testNumber = jubilazo.getFirstNumber();

        assertThat(testNumber, equalTo(firstNumber));
    }

    @Test
    public void verifyTheCorrectReturnOfTheSecondNumber() {
        Integer testNumber = jubilazo.getSecondNumber();

        assertThat(testNumber, equalTo(secondNumber));
    }

    @Test
    public void verifyTheCorrectReturnOfTheThirdNumber() {
        Integer testNumber = jubilazo.getThirdNumber();

        assertThat(testNumber, equalTo(thirdNumber));
    }

    @Test
    public void verifyTheCorrectReturnOfTheFourthNumber() {
        Integer testNumber = jubilazo.getFourthNumber();

        assertThat(testNumber, equalTo(fourthNumber));
    }

    @Test
    public void verifyTheCorrectReturnOfTheFifthNumber() {
        Integer testNumber = jubilazo.getFifthNumber();

        assertThat(testNumber, equalTo(fifthNumber));
    }

    @Test
    public void verifyTheCorrectReturnOfTheSixthNumber() {
        Integer testNumber = jubilazo.getSixthNumber();

        assertThat(testNumber, equalTo(sixthNumber));
    }
}
