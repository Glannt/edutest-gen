package com.dotnt.server.service;

import com.dotnt.server.dto.DashboardMetricsDTO;
import com.dotnt.server.entity.DashBoardConfig;

import java.util.List;
import java.util.Optional;

public interface DashboardService {
    DashboardMetricsDTO getKeyMetricsAndUserActivity();
    List<DashBoardConfig> getAllConfigs();
    DashBoardConfig getConfigById(String id);
    DashBoardConfig saveConfig(DashBoardConfig config);
    DashBoardConfig updateConfig(String id, DashBoardConfig config);
    void deleteConfig(String id);
}
