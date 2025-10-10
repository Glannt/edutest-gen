package com.dotnt.server.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ContentBlockDto {
    private String type; // "text" hoặc "formula"
    private String value; // chỉ dùng khi type=text
    private String latex; // chỉ dùng khi type=formula
    private Object ast;   // JSON AST, chỉ dùng khi type=formula
}
