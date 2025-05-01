package database

import (
	"fmt"
	"log"
	"os"

	"futsal-booking/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// DB is the global database connection instance
var DB *gorm.DB

// Connect initializes the database connection and performs auto migrations
func Connect() {
	// Get the PostgreSQL connection string from the environment variables
	dsn := os.Getenv("POSTGRES_DSN")
	if dsn == "" {
		log.Fatal("Error: POSTGRES_DSN environment variable is not set")
	}

	// Open a connection to the database
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to the database:", err)
	}

	// Store the database connection in the global DB variable
	DB = db

	// Run auto-migration for all models
	if err := db.AutoMigrate(&models.User{}); err != nil {
		log.Fatal("Failed to run migrations:", err)
	}

	if err := db.AutoMigrate(&models.Ground{}); err != nil {
		log.Fatal("Failed to run migrations:", err)
	}
	if err := db.AutoMigrate(&models.TimeSlot{}); err != nil {
		log.Fatal("Failed to run migrations:", err)
	}
	if err := db.AutoMigrate(&models.BookingRequest{}); err != nil {
		log.Fatal("Failed to run migrations:", err)
	}
	if err := db.AutoMigrate(&models.RecurringReservation{}); err != nil {
		log.Fatal("Failed to run migrations:", err)
	}

	// Print success message once the connection and migration are successful
	fmt.Println("✅ Database connected & migrated.")
}
