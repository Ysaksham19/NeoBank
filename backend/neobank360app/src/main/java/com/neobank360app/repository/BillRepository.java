package com.neobank360app.repository;

import com.neobank360app.entity.Bill;
import com.neobank360app.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {

    // ── Non-paginated (kept for budget/insights calculations) ───────────────
    List<Bill> findByUserOrderByDueDateAsc(User user);

    List<Bill> findByUserAndStatusOrderByDueDateAsc(User user, String status);

    // ── Paginated ────────────────────────────────────────────────────────────

    /**
     * All bills for a user sorted by due date, paginated.
     */
    Page<Bill> findByUserOrderByDueDateAsc(User user, Pageable pageable);

    /**
     * Bills filtered by status, paginated.
     */
    Page<Bill> findByUserAndStatusOrderByDueDateAsc(User user, String status, Pageable pageable);
}
