package main

import (
	"futsal-booking/config"
	"futsal-booking/database"
	"futsal-booking/middlewares"
	"futsal-booking/routes"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// configuring firebase
	config.InitFirebase()

	// Connect to the database
	database.Connect()

	// Create Gin router
	r := gin.Default()
	api := r.Group("/api")
	{
		api.Use(middlewares.FirebaseAuthMiddleware(database.DB)) // protect all
		// api.GET("/user/me", handler.GetProfile(database.DB))
	}

	// Setup routes
	routes.SetupRouter(r)

	// Start the server on the specified port or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server is running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}
