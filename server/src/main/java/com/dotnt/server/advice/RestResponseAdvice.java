package com.dotnt.server.advice;

import com.dotnt.server.annotation.RestResponse;
import com.dotnt.server.dto.response.RestResponseWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;
import org.springframework.http.server.ServletServerHttpResponse;
@RestControllerAdvice
public class RestResponseAdvice implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        // Chỉ áp dụng cho các method hoặc class có @RestResponse
        return returnType.getContainingClass().isAnnotationPresent(RestResponse.class)
                || returnType.hasMethodAnnotation(RestResponse.class);
    }


    @Override
    public Object beforeBodyWrite(Object body,
                                  MethodParameter returnType,
                                  MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request,
                                  ServerHttpResponse response) {

        if (body instanceof RestResponseWrapper) {
            return body;
        }

        HttpServletResponse servletResponse = ((ServletServerHttpResponse) response).getServletResponse();

        String httpMethod = String.valueOf(request.getMethod());
        switch (httpMethod) {
            case "POST":
                servletResponse.setStatus(HttpServletResponse.SC_CREATED); // 201
                break;
            case "DELETE":
                servletResponse.setStatus(HttpServletResponse.SC_NO_CONTENT); // 204
                break;
            case "GET":
                servletResponse.setStatus(HttpServletResponse.SC_OK); // 200
                break;
            default:
                servletResponse.setStatus(HttpServletResponse.SC_OK);
        }

        return RestResponseWrapper.success(body);
    }
}