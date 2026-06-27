package com.neobank360app.dto;

import java.math.BigDecimal;
import java.util.List;

public class FinancialInsightsDTO {

    private Long userId;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal savings;           // totalIncome - totalExpense (can be negative)
    private List<TrendEntryDTO> trendSummary;  // last 6 months

    public FinancialInsightsDTO() {}

    public Long getUserId()                          { return userId; }
    public void setUserId(Long v)                    { this.userId = v; }

    public BigDecimal getTotalIncome()               { return totalIncome; }
    public void setTotalIncome(BigDecimal v)         { this.totalIncome = v; }

    public BigDecimal getTotalExpense()              { return totalExpense; }
    public void setTotalExpense(BigDecimal v)        { this.totalExpense = v; }

    public BigDecimal getSavings()                   { return savings; }
    public void setSavings(BigDecimal v)             { this.savings = v; }

    public List<TrendEntryDTO> getTrendSummary()            { return trendSummary; }
    public void setTrendSummary(List<TrendEntryDTO> v)      { this.trendSummary = v; }
}