//package com.dotnt.server.repository;
//
//import com.dotnt.server.entity.License;
//import com.dotnt.server.enums.LicenseStatus;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//
//@Repository
//public interface LicenseRepository extends JpaRepository<License, UUID> {
//
//    Optional<License> findByLicenseKey(String licenseKey);
//
//    Optional<License> findByUserId(UUID userId);
//
//    List<License> findByStatus(LicenseStatus status);
//
//    List<License> findByExpiryDateBefore(LocalDateTime date);
//
//    @Query("SELECT l FROM License l WHERE l.currentUsage >= l.maxUsages")
//    List<License> findExceededUsageLicenses();
//
//    @Query("SELECT l FROM License l WHERE l.status = :status AND l.expiryDate > :currentDate")
//    List<License> findActiveValidLicenses(@Param("status") LicenseStatus status, @Param("currentDate") LocalDateTime currentDate);
//
//    boolean existsByLicenseKey(String licenseKey);
//
//    @Query("SELECT COUNT(l) FROM License l WHERE l.status = 'ACTIVE'")
//    long countActiveLicenses();
//}
