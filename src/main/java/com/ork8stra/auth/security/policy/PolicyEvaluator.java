package com.ork8stra.auth.security.policy;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

import static com.ork8stra.auth.security.policy.IAMPolicyModels.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class PolicyEvaluator {

    private final ObjectMapper objectMapper;

    public boolean isAllowed(List<String> policyDocuments, String action, String resource) {
        boolean allowed = false;

        for (String docJson : policyDocuments) {
            if (docJson == null || docJson.isBlank()) continue;

            try {
                PolicyDocument doc = objectMapper.readValue(docJson, PolicyDocument.class);
                
                for (PolicyStatement statement : doc.getStatement()) {
                    if (matches(statement, action, resource)) {
                        if ("Deny".equalsIgnoreCase(statement.getEffect())) {
                            return false; // Explicit deny wins
                        }
                        if ("Allow".equalsIgnoreCase(statement.getEffect())) {
                            allowed = true;
                        }
                    }
                }
            } catch (Exception e) {
                log.error("Failed to parse policy document: {}", e.getMessage());
            }
        }

        return allowed;
    }

    private boolean matches(PolicyStatement statement, String action, String resource) {
        return matchesAny(statement.getAction(), action) && matchesAny(statement.getResource(), resource);
    }

    private boolean matchesAny(List<String> patterns, String value) {
        if (patterns == null || value == null) return false;
        
        for (String pattern : patterns) {
            if ("*".equals(pattern)) return true;
            
            // Simple wildcard matching (e.g., project:*)
            String regex = pattern.replace(".", "\\.")
                                  .replace("*", ".*");
            if (Pattern.matches(regex, value)) {
                return true;
            }
        }
        return false;
    }
}
