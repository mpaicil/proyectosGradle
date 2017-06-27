package main;

import com.latam.miprueba.Calculadora;

public class Prueba{

    public static void main(String[] args){
        System.out.println("Salimo!!!");
        System.out.println("Seguro??!!!");
	Calculadora calc= new Calculadora();
	calc.setValor(5);
	System.out.println("Valor: "+String.valueOf( calc.getValor() ));
    }
}
