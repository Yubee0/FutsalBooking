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
		FCMToken string `json:"fcm_token"` // <-- NEW FIELD
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	ctx := context.Background()
	client, err := config.FirebaseApp.Auth(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initialize Firebase Auth"})
		return
	}

	_, err = client.GetUserByEmail(ctx, req.Email)
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
		return
	}

	params := (&auth.UserToCreate{}).Email(req.Email).Password(req.Password)
	firebaseUser, err := client.CreateUser(ctx, params)
	if err != nil {
		log.Printf("Error creating user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	user := models.User{
		FirebaseUID: firebaseUser.UID,
		Email:       req.Email,
		Role:        req.Role,
		Phone:       req.Phone,
		Name:        req.Name,
		FCMToken:    req.FCMToken, // <-- SAVING IT
	}

	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}
