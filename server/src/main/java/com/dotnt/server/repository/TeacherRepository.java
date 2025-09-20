package com.dotnt.server.repository;

import com.dotnt.server.entity.Teacher;
import com.dotnt.server.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, UUID> {

    Optional<Teacher> findByName(String username);

    Optional<Teacher> findByEmail(String email);

    Optional<Teacher> findByNameOrEmail(String username, String email);

    boolean existsByName(String username);

    boolean existsByEmail(String email);

//    List<Teacher> findByRole(UserRole role);

//    List<Teacher> findByIsActive(Boolean isActive);

//    @Query("SELECT u FROM User u WHERE u.license IS NOT NULL")
//    List<Teacher> findUsersWithLicense();

//    @Query("SELECT u FROM User u WHERE u.fullName LIKE %:name%")
//    List<Teacher> findByFullNameContaining(@Param("name") String name);
}
