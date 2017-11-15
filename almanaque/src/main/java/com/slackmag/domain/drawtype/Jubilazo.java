package com.slackmag.domain.drawtype;

public class Jubilazo {

    private Integer[] numbers;


    public Jubilazo(Integer[] listNumber) {
        this.numbers = listNumber;
    }

    public Integer getFirstNumber() {
        return numbers[0];
    }

    public Integer getSecondNumber() {
        return numbers[1];
    }

    public Integer getThirdNumber() {
        return numbers[2];
    }

    public Integer getFourthNumber() {
        return numbers[3];
    }

    public Integer getFifthNumber() {
        return numbers[4];
    }

    public Integer getSixthNumber() {
        return numbers[5];
    }
}
