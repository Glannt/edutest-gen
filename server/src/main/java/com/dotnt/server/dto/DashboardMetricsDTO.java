package com.dotnt.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardMetricsDTO {

    // Key metrics
    private Map<String, Long> keyMetrics;

    // User activity: timestamp -> số user hoạt động (Line chart / heatmap)
    private Map<String, Long> userActivity;
}
