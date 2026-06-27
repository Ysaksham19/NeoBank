package com.neobank360app.repository;

import com.neobank360app.entity.LoanApplication;
import com.neobank360app.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {

    // ── Non-paginated ───────────────────────────────────────────────────────
    List<LoanApplication> findByUserOrderByAppliedAtDesc(User user);

    List<LoanApplication> findByStatusOrderByAppliedAtAsc(String status);

    // ── Paginated ────────────────────────────────────────────────────────────

    /**
     * User's own loan applications, newest first — paginated.
     */
    Page<LoanApplication> findByUserOrderByAppliedAtDesc(User user, Pageable pageable);

    /**
     * Admin: all applications filtered by status (e.g. PENDING) — paginated.
     */
    Page<LoanApplication> findByStatusOrderByAppliedAtAsc(String status, Pageable pageable);

    /**
     * Admin: all applications regardless of status — paginated.
     */
    Page<LoanApplication> findAllByOrderByAppliedAtDesc(Pageable pageable);
}
