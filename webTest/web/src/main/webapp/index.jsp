<%--
  Created by IntelliJ IDEA.
  User: nxr
  Date: 5/22/17
  Time: 3:23 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.Date" %>
<%@ page import="com.latam.dto.Persona" %>
<%
  Persona guest = new Persona();
  guest.setNombre("Carlos");
%>
<html>
  <head>
    <title>$Title$</title>
  </head>
  <body>
  Holasto <%= guest.getNombre()%> <br> el dia: <%=new Date()%>
  </body>
</html>
