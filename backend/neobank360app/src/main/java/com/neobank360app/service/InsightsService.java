package com.neobank360app.service;

import com.neobank360app.dto.FinancialInsightsDTO;
import com.neobank360app.dto.TrendEntryDTO;
import com.neobank360app.entity.TransactionType;
import com.neobank360app.repository.InsightsRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class InsightsService {

    private final InsightsRepository insightsRepository;

    public InsightsService(InsightsRepository insightsRepository) {
        this.insightsRepository = insightsRepository;
    }

    @Transactional(readOnly = true)
    public FinancialInsightsDTO buildInsights(Long userId) {

        BigDecimal totalIncome  = insightsRepository.getTotalIncome(userId);
        BigDecimal totalExpense = insightsRepository.getTotalExpense(userId);
        BigDecimal savings      = totalIncome.subtract(totalExpense); // may be negative — never clamp

        List<TrendEntryDTO> trend = buildTrendSummary(userId);

        FinancialInsightsDTO dto = new FinancialInsightsDTO();
        dto.setUserId(userId);
        dto.setTotalIncome(totalIncome);
        dto.setTotalExpense(totalExpense);
        dto.setSavings(savings);
        dto.setTrendSummary(trend);
        return dto;
    }

    // ── Build 6-month trend, zero-padding missing months ─────────────────
    private List<TrendEntryDTO> buildTrendSummary(Long userId) {
        LocalDateTime since = LocalDateTime.now().minusMonths(6).withDayOfMonth(1)
                                           .withHour(0).withMinute(0).withSecond(0);

        List<Object[]> raw = insightsRepository.getRawTrendData(userId, since);

        // map: "YYYY-M" → TrendEntryDTO
        Map<String, TrendEntryDTO> map = new LinkedHashMap<>();

        // Pre-populate last 6 months with zeros
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM yyyy");
        for (int i = 5; i >= 0; i--) {
            LocalDateTime m = LocalDateTime.now().minusMonths(i);
            int yr  = m.getYear();
            int mo  = m.getMonthValue();
            String key = yr + "-" + mo;
            TrendEntryDTO entry = new TrendEntryDTO(
                    m.format(fmt), yr, mo, BigDecimal.ZERO, BigDecimal.ZERO);
            map.put(key, entry);
        }

        // Fill from DB results
        for (Object[] row : raw) {
            int yr   = ((Number) row[0]).intValue();
            int mo   = ((Number) row[1]).intValue();
            String key = yr + "-" + mo;
            TransactionType type = (TransactionType) row[2];
            BigDecimal sum       = (BigDecimal) row[3];

            if (map.containsKey(key)) {
                TrendEntryDTO entry = map.get(key);
                if (type == TransactionType.CREDIT) {
                    entry.setTotalIncome(sum);
                } else {
                    entry.setTotalExpense(sum);
                }
            }
        }

        return new ArrayList<>(map.values());
    }
}