package com.ork8stra.auth;

import com.ork8stra.user.PlatformRole;
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
    public void run(String... args) throws Exception {
        log.info("Running DataInitializer to ensure administrative access...");
        
        userRepository.findAll().forEach(user -> {
            if (!user.isAdmin()) {
                log.info("Promoting user {} to global ADMIN", user.getUsername());
                user.getRoles().add(PlatformRole.ADMIN);
                userRepository.save(user);
            }
        });
    }
}
