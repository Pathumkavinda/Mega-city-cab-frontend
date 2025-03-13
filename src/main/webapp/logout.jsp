<%-- 
    Document   : logout
    Created on : Mar 13, 2025, 5:09:21 PM
    Author     : Admin
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    // Invalidate the session
    session.invalidate();
    
    // Redirect to the home page or login page
    response.sendRedirect("index.jsp");
%>