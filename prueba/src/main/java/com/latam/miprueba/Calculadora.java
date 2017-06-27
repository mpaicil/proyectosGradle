package com.latam.miprueba;

public class Calculadora {

    private int valor;

    public Calculadora(){
        this.valor = 0;
    }

    public int getValor() {
        return this.valor;
    }

    public void setValor(int nuevovalor) {
        this.valor = nuevovalor;
    }
    public int suma(int nuevovalor){
        return this.valor += nuevovalor;
    }

}
