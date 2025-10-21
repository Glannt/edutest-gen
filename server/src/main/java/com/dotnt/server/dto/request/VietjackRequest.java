package com.dotnt.server.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VietjackRequest {
    private String grade;
    private String subject;
    private String chapter;
    private String lesson;
    private String type;
}
