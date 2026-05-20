package com.dotnt.server.repository;

import com.dotnt.server.entity.DashBoardConfig;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DashboardConfigRepository extends MongoRepository<DashBoardConfig, String> {
    // Tìm tất cả widget theo collection/entity
    List<DashBoardConfig> findByEntity(String entity);

    // Tìm widget theo tên
    List<DashBoardConfig> findByWidgetName(String widgetName);

    // Tìm widget theo entity và widgetType
    List<DashBoardConfig> findByEntityAndWidgetType(String entity, String widgetType);
}
