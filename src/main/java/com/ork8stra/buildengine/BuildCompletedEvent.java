package com.ork8stra.buildengine;

import java.util.UUID;

public record BuildCompletedEvent(UUID buildId, UUID applicationId, String imageTag, boolean success) {
}
