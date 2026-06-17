package com.neobank360app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class Neobank360appApplication {

	public static void main(String[] args) {
		SpringApplication.run(Neobank360appApplication.class, args);
	}

}
