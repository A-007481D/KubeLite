package com.ork8stra.auth;

import com.ork8stra.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void run(String... args) throws Exception {
        log.info("Running DataInitializer to ensure administrative access...");
        
        userRepository.findAll().forEach(user -> {
            if (!user.isAdmin()) {
                log.info("Promoting user {} to global ADMIN", user.getUsername());
                user.getRoles().add(com.ork8stra.user.PlatformRole.ADMIN);
                userRepository.saveAndFlush(user);
            } else {
                log.info("User {} already has ADMIN role", user.getUsername());
            }
        });
    }
}
