package com.latam.test.dto;

import java.util.Date;

/**
 * Created by nxr on 5/22/17.
 */
public class Persona {

    private String nombre;
    private String apellido;
    private int edad;
    private Date fecha;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public int getEdad() {
        return edad;
    }

    public void setEdad(int edad) {
        this.edad = edad;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        //this.fecha = fecha;
    }
}
