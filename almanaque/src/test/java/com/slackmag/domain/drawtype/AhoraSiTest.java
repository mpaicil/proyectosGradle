package com.slackmag.domain.drawtype;

import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertThat;

public class AhoraSiTest {

    private Integer firstNumber = 2;
    private Integer secondNumber = 3;
    private Integer thirdNumber = 11;
    private Integer fourthNumber = 21;
    private Integer fifthNumber = 4;
    private Integer sixthNumber = 13;
    
    private AhoraSi ahoraSi;

    @Before
    public void setup() {
        Integer[] listNumber = new Integer[6];
        listNumber[0] = firstNumber;
        listNumber[1] = secondNumber;
        listNumber[2] = thirdNumber;
        listNumber[3] = fourthNumber;
        listNumber[4] = fifthNumber;
        listNumber[5] = sixthNumber;

        ahoraSi = new AhoraSi(listNumber);
    }

    @Test
    public void verifyTheCorrectReturnOfTheFirstNumber() {
        Integer testNumber = ahoraSi.getFirstNumber();

        assertThat(testNumber, equalTo(firstNumber));
    }

    @Test
    public void verifyTheCorrectReturnOfTheSecondNumber() {
        Integer testNumber = ahoraSi.getSecondNumber();

        assertThat(testNumber, equalTo(secondNumber));
    }

    @Test
    public void verifyTheCorrectReturnOfTheThirdNumber() {
        Integer testNumber = ahoraSi.getThirdNumber();

        assertThat(testNumber, equalTo(thirdNumber));
    }

    @Test
    public void verifyTheCorrectReturnOfTheFourthNumber() {
        Integer testNumber = ahoraSi.getFourthNumber();

        assertThat(testNumber, equalTo(fourthNumber));
    }

    @Test
    public void verifyTheCorrectReturnOfTheFifthNumber() {
        Integer testNumber = ahoraSi.getFifthNumber();

        assertThat(testNumber, equalTo(fifthNumber));
    }

    @Test
    public void verifyTheCorrectReturnOfTheSixthNumber() {
        Integer testNumber = ahoraSi.getSixthNumber();

        assertThat(testNumber, equalTo(sixthNumber));
    }
}
