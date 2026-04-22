package com.citu.inventory.controller;

import com.citu.inventory.model.User;
import com.citu.inventory.repository.UserRepository;
import com.citu.inventory.security.JwtUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // ── Login ──────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        return userRepository.findByEmail(request.email())
                .filter(u -> passwordEncoder.matches(request.password(), u.getPassword()))
                .map(u -> {
                    String token = jwtUtil.generateToken(u.getEmail(), u.getId(), u.getUserRole().name());
                    return ResponseEntity.ok(Map.of(
                            "token", token,
                            "user", userDto(u)
                    ));
                })
                .orElse(ResponseEntity.status(401).body(Map.of("message", "Invalid email or password")));
    }

    // ── Register ───────────────────────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.email()))
            return ResponseEntity.badRequest().body(Map.of("message", "Email already in use"));
        if (request.employeeId() != null && userRepository.existsByEmployeeId(request.employeeId()))
            return ResponseEntity.badRequest().body(Map.of("message", "Employee ID already registered"));

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .department(request.department())
                .role(request.role())
                .employeeId(request.employeeId())
                .build();

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Account created successfully"));
    }

    // ── Update Profile ─────────────────────────────────────────────────────────
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal User principal,
                                           @RequestBody ProfileUpdateRequest request) {
        userRepository.findById(principal.getId()).ifPresent(u -> {
            if (request.name() != null) u.setName(request.name());
            if (request.department() != null) u.setDepartment(request.department());
            if (request.role() != null) u.setRole(request.role());
            userRepository.save(u);
        });
        return ResponseEntity.ok(Map.of("message", "Profile updated"));
    }

    // ── Change Password ────────────────────────────────────────────────────────
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal User principal,
                                            @RequestBody ChangePasswordRequest request) {
        return userRepository.findById(principal.getId()).map(u -> {
            if (!passwordEncoder.matches(request.currentPassword(), u.getPassword()))
                return ResponseEntity.badRequest().body(Map.of("message", "Current password is incorrect"));
            u.setPassword(passwordEncoder.encode(request.newPassword()));
            userRepository.save(u);
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── DTOs ───────────────────────────────────────────────────────────────────
    private Map<String, Object> userDto(User u) {
        return Map.of(
                "id", u.getId(),
                "name", u.getName(),
                "email", u.getEmail(),
                "department", u.getDepartment() != null ? u.getDepartment() : "",
                "role", u.getRole() != null ? u.getRole() : "",
                "employeeId", u.getEmployeeId() != null ? u.getEmployeeId() : ""
        );
    }

    record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}
    record RegisterRequest(@NotBlank String name, @NotBlank @Email String email,
                           @NotBlank String password, String department, String role, String employeeId) {}
    record ProfileUpdateRequest(String name, String department, String role) {}
    record ChangePasswordRequest(String currentPassword, String newPassword) {}
}
