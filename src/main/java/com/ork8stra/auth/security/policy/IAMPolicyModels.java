package com.ork8stra.auth.security.policy;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * Holder for IAM Policy Models.
 */
public class IAMPolicyModels {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PolicyDocument {
        private String Version;
        private List<PolicyStatement> Statement;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PolicyStatement {
        private String Sid;
        private String Effect; // "Allow" or "Deny"
        private List<String> Action;
        private List<String> Resource;
    }
}
