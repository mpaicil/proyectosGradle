package com.slackmag.domain.drawtype;

public class Loto {

    private Integer[] numbers;
    private Integer joker;

    public Loto(Integer[] numbers, Integer joker) {
        this.numbers = numbers;
        this.joker = joker;
    }

    public Loto() {
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

    public Integer getJokerNumber() {
        return joker;
    }
}
