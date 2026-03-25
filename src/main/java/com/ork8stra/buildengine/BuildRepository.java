package com.ork8stra.buildengine;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface BuildRepository extends JpaRepository<Build, UUID> {
    List<Build> findByApplicationId(UUID applicationId);
    java.util.Optional<Build> findFirstByApplicationIdOrderByStartTimeDesc(UUID applicationId);
}
