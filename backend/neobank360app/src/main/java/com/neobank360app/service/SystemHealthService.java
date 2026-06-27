//package com.neobank360app.service;
//
//
//import jakarta.persistence.EntityManager;
//import org.springframework.stereotype.Service;
//
//import com.neobank360app.dto.SystemHealthDTO;
//
//import java.lang.management.ManagementFactory;
//
//@Service
//public class SystemHealthService {
//
//    private final EntityManager entityManager;
//
//    public SystemHealthService(EntityManager entityManager) {
//        this.entityManager = entityManager;
//    }
//
//    public SystemHealthDTO getSystemHealth() {
//        String dbStatus;
//        try {
//            entityManager.createNativeQuery("SELECT 1").getSingleResult();
//            dbStatus = "UP";
//        } catch (Exception e) {
//            dbStatus = "DOWN";
//        }
//        long uptimeSeconds = ManagementFactory.getRuntimeMXBean().getUptime() / 1000;
//        int activeThreads  = Thread.activeCount();
//        return new SystemHealthDTO(dbStatus, activeThreads, uptimeSeconds);
//    }
//}