package com.ork8stra.auth.security;

import com.ork8stra.user.User;
import com.ork8stra.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

import static org.springframework.security.core.userdetails.User.builder;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        org.springframework.security.core.userdetails.User.UserBuilder builder = builder()
                .username(user.getUsername())
                .password(user.getPasswordHash());

        java.util.List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> {
                    String authority = "ROLE_" + role.name();
                    return new SimpleGrantedAuthority(authority);
                })
                .collect(Collectors.toList());

        System.out.println("[DEBUG AUTH] User: " + user.getUsername() + ", Roles in DB: " + user.getRoles() + ", Mapped Authorities: " + authorities);

        return builder
                .authorities(authorities)
                .disabled(!user.isEnabled())
                .build();
    }
}
