package com.ork8stra.teammanagement;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;

    @Transactional
    public Team createTeam(String name, UUID organizationId) {
        Team team = new Team(name, organizationId);
        return teamRepository.save(team);
    }

    public List<Team> getTeamsByOrganizationId(UUID organizationId) {
        return teamRepository.findByOrganizationId(organizationId);
    }

    public Team getTeamById(UUID id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));
    }

    @Transactional
    public void deleteTeam(UUID id) {
        teamRepository.deleteById(id);
    }
}
