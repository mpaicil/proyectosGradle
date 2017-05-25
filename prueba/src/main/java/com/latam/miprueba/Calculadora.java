package com.latam.miprueba;

public class Calculadora {

    public Calculadora(){
        this.valor = 0;
    }

    public Integer getValor() {
        return valor;
    }

    public void setValor(Integer valor) {
        this.valor = valor;
    }
    public void suma(Integer valor){
        this.valor += valor;
    }

    private Integer valor;


}
