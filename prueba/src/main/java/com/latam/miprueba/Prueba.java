package com.latam.miprueba;

public class Prueba{

    public static void main(String[] args){
        System.out.println("Salimo!!!");
        System.out.println("Seguro??!!!");
	Calculadora calc= new Calculadora();
	calc.setValor((Integer) 5);
	System.out.println("Valor: "+calc.getValor().toString());
    }
}
