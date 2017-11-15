package com.slackmag.domain;

import com.slackmag.domain.drawtype.*;

import java.time.LocalDate;
import java.util.List;

public class Draw {

    private Integer drawId;
    private LocalDate date;

    private Loto loto;
    private Revancha revancha;
    private Desquite desquite;
    private AhoraSi ahoraSi;
    private List<Jubilazo> jubilazoList;
    private Multiplicador multiplicador;


    public Draw(Integer drawId, LocalDate date, Loto loto, Revancha revancha, Desquite desquite, AhoraSi ahoraSi, List<Jubilazo> jubilazos, Multiplicador multiplicador) {
        this.drawId = drawId;
        this.date = date;
        this.loto = loto;
        this.revancha = revancha;
        this.desquite = desquite;
        this.ahoraSi = ahoraSi;
        this.jubilazoList = jubilazos;
        this.multiplicador = multiplicador;
    }


    public LocalDate getDate() {
        return date;
    }

    public Integer getDrawId() {
        return drawId;
    }

    public Loto getLoto() {
        return loto;
    }
}
