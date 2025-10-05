package com.dotnt.server.advice;

import com.dotnt.server.annotation.PagingResponse;
import com.dotnt.server.dto.response.PagingResponseWrapper;
import com.dotnt.server.dto.response.RestResponseWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.MethodParameter;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;
import org.springframework.http.server.ServletServerHttpResponse;

@RestControllerAdvice
public class PagingResponseAdvice implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType,
                            Class<? extends HttpMessageConverter<?>> converterType) {
        // Chỉ áp dụng cho method có @PagingResponse
        return returnType.hasMethodAnnotation(PagingResponse.class);
    }

    @Override
    public Object beforeBodyWrite(Object body,
                                  MethodParameter returnType,
                                  MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request,
                                  ServerHttpResponse response) {

        HttpServletResponse servletResponse = ((ServletServerHttpResponse) response).getServletResponse();
        servletResponse.setStatus(HttpServletResponse.SC_OK);

        // Nếu API đã được wrap RestResponseWrapper, chỉ wrap content
        if (body instanceof RestResponseWrapper<?> restWrapper) {
            Object originalData = restWrapper.getData();
            if (originalData instanceof Page<?> page) {
                @SuppressWarnings("unchecked")
                RestResponseWrapper<PagingResponseWrapper<Object>> wrapper =
                        (RestResponseWrapper<PagingResponseWrapper<Object>>) restWrapper;

                wrapper.setData(PagingResponseWrapper.of((Page<Object>) page));
                return wrapper;
            }
            return restWrapper;
        }

        // Nếu chưa wrap, wrap trực tiếp Page<T>
        if (body instanceof Page<?> page) {
            return PagingResponseWrapper.of(page);
        }

        return body; // các trường hợp khác giữ nguyên
    }
}