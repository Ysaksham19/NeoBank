package com.neobank360app.dto;

import java.math.BigDecimal;

public class AdminDashboardDTO {

    private long totalUsers;
    private long totalActiveUsers;
    private long totalLoans;
    private long pendingApprovals;
    private long totalTransactions;
    private double platformSavingsRate;  // % — can be null if no income

    public AdminDashboardDTO() {}

    public long getTotalUsers()                          { return totalUsers; }
    public void setTotalUsers(long v)                    { this.totalUsers = v; }

    public long getTotalActiveUsers()                    { return totalActiveUsers; }
    public void setTotalActiveUsers(long v)              { this.totalActiveUsers = v; }

    public long getTotalLoans()                          { return totalLoans; }
    public void setTotalLoans(long v)                    { this.totalLoans = v; }

    public long getPendingApprovals()                    { return pendingApprovals; }
    public void setPendingApprovals(long v)              { this.pendingApprovals = v; }

    public long getTotalTransactions()                   { return totalTransactions; }
    public void setTotalTransactions(long v)             { this.totalTransactions = v; }

    public double getPlatformSavingsRate()           { return platformSavingsRate; }
    public void setPlatformSavingsRate(double v)     { this.platformSavingsRate = v; }
}