package com.slackmag.domain.drawtype;

import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.*;

public class RevanchaTest {

    private Integer firstNumber = 2;
    private Integer secondNumber = 34;
    private Integer thirdNumber = 12;
    private Integer fourthNumber = 41;
    private Integer fifthNumber = 4;
    private Integer sixthNumber = 13;

    private Revancha revancha;

    @Before
    public void setup() {
        Integer[] listNumber = new Integer[6];
        listNumber[0] = firstNumber;
        listNumber[1] = secondNumber;
        listNumber[2] = thirdNumber;
        listNumber[3] = fourthNumber;
        listNumber[4] = fifthNumber;
        listNumber[5] = sixthNumber;

        revancha = new Revancha(listNumber);
    }

    @Test
    public void verifyTheCorrectReturnOfTheFirstNumber() {
        Integer testNumber = revancha.getFirstNumber();

        assertThat(testNumber, equalTo(firstNumber));
    }

    @Test
    public void verifyTheCorrectReturnOfTheSecondNumber() {
        Integer testNumber = revancha.getSecondNumber();

        assertThat(testNumber, equalTo(secondNumber));
    }

    @Test
    public void verifyTheCorrectReturnOfTheThirdNumber() {
        Integer testNumber = revancha.getThirdNumber();

        assertThat(testNumber, equalTo(thirdNumber));
    }

    @Test
    public void verifyTheCorrectReturnOfTheFourthNumber() {
        Integer testNumber = revancha.getFourthNumber();

        assertThat(testNumber, equalTo(fourthNumber));
    }

    @Test
    public void verifyTheCorrectReturnOfTheFifthNumber() {
        Integer testNumber = revancha.getFifthNumber();

        assertThat(testNumber, equalTo(fifthNumber));
    }

    @Test
    public void verifyTheCorrectReturnOfTheSixthNumber() {
        Integer testNumber = revancha.getSixthNumber();

        assertThat(testNumber, equalTo(sixthNumber));
    }


}