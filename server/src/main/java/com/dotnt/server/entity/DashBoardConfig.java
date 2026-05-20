package com.dotnt.server.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Document(collection = "dashboard_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashBoardConfig {
    @Id
    private String id;
    private String widgetName; // "KeyMetrics", "UserActivityChart"
    private String entity; // collection name: "users", "classes", "assignments", ...
    private List<String> fields; // fields hiển thị trong widget
    private String widgetType; // "card", "lineChart", "pieChart", "table"
    private Map<String, Object> filters; // ví dụ: {status: "active"}
}
