package com.latam.drools.example.dto;

/**
 * Created by nxr on 6/21/17.
 */
public class Message {

    private String name;
    private String msg;

    public Message(String name,String msg) {
        setName(name);
        setMsg(msg);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public String generateMsg(){
        return getName() +" says "+ getMsg();
    }
}
