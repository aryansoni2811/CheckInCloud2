package com.example.Checkincloudbackend;

import com.zaxxer.hikari.HikariDataSource;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CheckincloudbackendApplication {

	@Autowired
	private HikariDataSource dataSource;

	public static void main(String[] args) {
		SpringApplication.run(CheckincloudbackendApplication.class, args);
	}

	@PreDestroy
	public void onShutdown() {
		if (dataSource != null) {
			dataSource.close(); // Shutdown Hikari connection pool
		}
	}
}
