package com.dotnt.server.service.impl;


import com.dotnt.server.dto.DashboardMetricsDTO;
import com.dotnt.server.entity.DashBoardConfig;
import com.dotnt.server.entity.User;
import com.dotnt.server.enums.UserRole;
import com.dotnt.server.repository.DashboardConfigRepository;
import com.dotnt.server.repository.UserRepository;
import com.dotnt.server.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final DashboardConfigRepository dashboardConfigRepository;

    @Override
    public DashboardMetricsDTO getKeyMetricsAndUserActivity() {
        // Lấy cache nếu có
        DashBoardConfig cached = getCachedDashboardMetrics();
        if (cached != null && cached.getFilters() != null) {
            try {
                @SuppressWarnings("unchecked")
                Map<String, Object> metrics = (Map<String, Object>) cached.getFilters().get("metrics");

                if (metrics != null) {
                    @SuppressWarnings("unchecked")
                    Map<String, Long> keyMetrics = (Map<String, Long>) metrics.get("keyMetrics");
                    @SuppressWarnings("unchecked")
                    Map<String, Long> userActivity = (Map<String, Long>) metrics.get("userActivity");

                    return DashboardMetricsDTO.builder()
                            .keyMetrics(keyMetrics)
                            .userActivity(userActivity)
                            .build();
                }
            } catch (Exception e) {
                log.warn("⚠️ Lỗi khi parse cache DashboardMetrics: {}", e.getMessage());
            }
        }

        // Nếu không có cache hoặc lỗi thì tính lại
        return calculateAndSaveDashboardMetrics();
    }

    /**
     * 🧮 Hàm chính tính toán dashboard metrics và lưu lại MongoDB
     */
    private DashboardMetricsDTO calculateAndSaveDashboardMetrics() {
        List<User> allUsers = userRepository.findAll();

        // --- Key Metrics ---
        long teacherCount = allUsers.stream()
                .filter(u -> u.getRole() == UserRole.TEACHER)
                .count();


        long activeAccounts = allUsers.stream()
                .filter(User::isActive)
                .count();

        long lockedAccounts = allUsers.stream()
                .filter(u -> !u.isActive())
                .count();

        long onlineUsers = allUsers.stream()
                .filter(u -> u.getLastLogin() != null)
                .filter(u -> {
                    long diff = new Date().getTime() - u.getLastLogin().getTime();
                    return diff <= 10 * 60 * 1000; // 10 phút
                })
                .count();

        Map<String, Long> keyMetrics = new LinkedHashMap<>();
        keyMetrics.put("teachers", teacherCount);
        keyMetrics.put("activeAccounts", activeAccounts);
        keyMetrics.put("lockedAccounts", lockedAccounts);
        keyMetrics.put("onlineUsers", onlineUsers);

        // --- User Activity ---
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Map<String, Long> userActivity = allUsers.stream()
                .filter(u -> u.getLastLogin() != null)
                .collect(Collectors.groupingBy(
                        u -> sdf.format(u.getLastLogin()),
                        Collectors.counting()
                ));

        DashboardMetricsDTO dto = DashboardMetricsDTO.builder()
                .keyMetrics(keyMetrics)
                .userActivity(userActivity)
                .build();

        // --- Lưu cache vào Mongo ---
        Map<String, Object> filters = new HashMap<>();
        filters.put("metrics", Map.of(
                "keyMetrics", keyMetrics,
                "userActivity", userActivity
        ));

        DashBoardConfig existing = getCachedDashboardMetrics();
        DashBoardConfig config = existing != null
                ? existing
                : DashBoardConfig.builder()
                .widgetName("AdminDashboardMetrics")
                .entity("users")
                .widgetType("cachedData")
                .build();

        config.setFilters(filters);

        dashboardConfigRepository.save(config);
        log.info("✅ Dashboard metrics recalculated and cached at {}", new Date());

        return dto;
    }

    /**
     * 🔁 Lấy cache hiện có từ Mongo
     */
    private DashBoardConfig getCachedDashboardMetrics() {
        List<DashBoardConfig> list = dashboardConfigRepository.findByWidgetName("AdminDashboardMetrics");
        return list.isEmpty() ? null : list.get(0);
    }

    /**
     * 🕒 Schedule cập nhật lại Dashboard Metrics mỗi 10 phút
     */
    @Scheduled(fixedRate = 60 * 1000)
    public void scheduledDashboardMetricsUpdate() {
        calculateAndSaveDashboardMetrics();
        log.info("[DashboardScheduler] Metrics auto-updated at {}", new Date());
    }

    // --- CRUD Configs ---
    @Override
    public List<DashBoardConfig> getAllConfigs() {
        return dashboardConfigRepository.findAll();
    }

    @Override
    public DashBoardConfig getConfigById(String id) {
        return dashboardConfigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Config not found with id: " + id));
    }

    @Override
    public DashBoardConfig saveConfig(DashBoardConfig config) {
        return dashboardConfigRepository.save(config);
    }

    @Override
    public DashBoardConfig updateConfig(String id, DashBoardConfig config) {
        return dashboardConfigRepository.findById(id)
                .map(existing -> {
                    existing.setWidgetName(config.getWidgetName());
                    existing.setEntity(config.getEntity());
                    existing.setFields(config.getFields());
                    existing.setWidgetType(config.getWidgetType());
                    existing.setFilters(config.getFilters());
                    return dashboardConfigRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Config not found with id: " + id));
    }

    @Override
    public void deleteConfig(String id) {
        dashboardConfigRepository.deleteById(id);
    }
}
