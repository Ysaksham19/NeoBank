package com.neobank360app.dto;

import java.math.BigDecimal;

public class TrendEntryDTO {

    private String monthLabel;   // e.g. "Jan 2026"
    private int year;
    private int month;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;

    public TrendEntryDTO() {}

    public TrendEntryDTO(String monthLabel, int year, int month,
                         BigDecimal totalIncome, BigDecimal totalExpense) {
        this.monthLabel   = monthLabel;
        this.year         = year;
        this.month        = month;
        this.totalIncome  = totalIncome;
        this.totalExpense = totalExpense;
    }

    public String getMonthLabel()            { return monthLabel; }
    public void setMonthLabel(String v)      { this.monthLabel = v; }

    public int getYear()                     { return year; }
    public void setYear(int v)               { this.year = v; }

    public int getMonth()                    { return month; }
    public void setMonth(int v)              { this.month = v; }

    public BigDecimal getTotalIncome()       { return totalIncome; }
    public void setTotalIncome(BigDecimal v) { this.totalIncome = v; }

    public BigDecimal getTotalExpense()       { return totalExpense; }
    public void setTotalExpense(BigDecimal v) { this.totalExpense = v; }
}