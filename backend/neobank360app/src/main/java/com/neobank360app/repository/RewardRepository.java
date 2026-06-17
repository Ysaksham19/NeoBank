package com.neobank360app.repository;

import com.neobank360app.entity.Reward;
import com.neobank360app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RewardRepository
        extends JpaRepository<Reward, Long> {

    List<Reward> findByUser(
            User user
    );
}