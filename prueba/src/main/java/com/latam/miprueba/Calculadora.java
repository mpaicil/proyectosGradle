package com.latam.miprueba;

public class Calculadora {

    private Integer valor;

    public Calculadora(){
        this.valor = 0;
    }

    public Integer getValor() {
        return this.valor;
    }

    public void setValor(Integer nuevovalor) {
        this.valor = nuevovalor;
    }
    public void suma(Integer nuevovalor){
        this.valor += nuevovalor;
    }

}
