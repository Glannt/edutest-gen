package com.dotnt.server.controller;

import com.dotnt.server.annotation.RestResponse;
import com.dotnt.server.dto.DashboardMetricsDTO;
import com.dotnt.server.entity.DashBoardConfig;
import com.dotnt.server.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("admin/dashboard")
@RestResponse
@RequiredArgsConstructor
public class DashBoardController {
    private final DashboardService dashboardService;



    @GetMapping("metrics")
    public DashboardMetricsDTO getDashboardMetrics() {
        return dashboardService.getKeyMetricsAndUserActivity();
    }


    @GetMapping("/{id}")
    public DashBoardConfig getConfigById(@PathVariable String id) {
        return dashboardService.getConfigById(id);
    }

    @PostMapping
    public DashBoardConfig createConfig(@RequestBody DashBoardConfig config) {
        return dashboardService.saveConfig(config);
    }

    @PutMapping("/{id}")
    public DashBoardConfig updateConfig(@PathVariable String id, @RequestBody DashBoardConfig config) {
        return dashboardService.updateConfig(id, config);
    }

    @DeleteMapping("/{id}")
    public void deleteConfig(@PathVariable String id) {
        dashboardService.deleteConfig(id);
    }
}
