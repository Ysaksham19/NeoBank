package com.neobank360app.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class EmiCalculatorUtil {

    private EmiCalculatorUtil() {
    }

    public static BigDecimal calculateEMI(
            BigDecimal principal,
            BigDecimal annualRate,
            Integer tenureMonths
    ) {

        double principalValue = principal.doubleValue();

        double monthlyRate =
                annualRate.doubleValue() / 12 / 100;

        int months = tenureMonths;

        double emi =
                (principalValue
                        * monthlyRate
                        * Math.pow(1 + monthlyRate, months))
                        /
                        (Math.pow(1 + monthlyRate, months) - 1);

        return BigDecimal.valueOf(emi)
                .setScale(2, RoundingMode.HALF_UP);
    }
}