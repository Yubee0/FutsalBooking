package handler

import (
	"context"
	"futsal-booking/config"
	"futsal-booking/database"
	"futsal-booking/models"
	"log"
	"net/http"

	"firebase.google.com/go/v4/auth" // Correct Firebase import
	"github.com/gin-gonic/gin"
)

func Register(c *gin.Context) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Role     string `json:"role"`
		Phone    string `json:"phone"`
		Name     string `json:"name"`
	}

	// Validate request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Initialize Firebase Auth client
	ctx := context.Background()
	client, err := config.FirebaseApp.Auth(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initialize Firebase Auth"})
		return
	}

	// Check if user already exists
	_, err = client.GetUserByEmail(ctx, req.Email)
	if err == nil {
		// User already exists
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
		return
	}

	// // If the error is 'user not found', continue to create the user
	// if err.Error() == "auth/user-not-found" {
	// 	// User does not exist, proceed to create the new user
	// } else {
	// 	log.Printf("Error checking user existence: %v", err)
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check user existence"})
	// 	return
	// }

	// Using Firebase SDK to create a new user
	params := (&auth.UserToCreate{}).Email(req.Email).Password(req.Password)
	firebaseUser, err := client.CreateUser(ctx, params)
	if err != nil {
		log.Printf("Error checking user existence: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// Save custom fields to the DB
	user := models.User{
		FirebaseUID: firebaseUser.UID,
		Email:       req.Email,
		Role:        req.Role,
		Phone:       req.Phone,
		Name:        req.Name,
	}

	// Store user in DB
	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}
