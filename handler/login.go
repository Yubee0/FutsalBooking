package handler

import (
	"bytes"
	"encoding/json"
	"futsal-booking/database"
	"futsal-booking/models"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// Store securely

func Login(c *gin.Context) {
	// Log Firebase API Key for debugging purposes

	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}
	var firebaseAPIKey = os.Getenv("FIREBASE_API_KEY")

	if firebaseAPIKey != "" {
		log.Println("Firebase API Key:", firebaseAPIKey)
	}
	if firebaseAPIKey == "" {
		log.Println("Firebase API Key is missing!")
	} else {
		log.Println("Firebase API Key is loaded successfully.")
	}

	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		FCMToken string `json:"fcm_token"`
	}

	// Bind the request JSON to struct
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	log.Println("fcmtoken:", req.FCMToken)

	// Build Firebase REST API request
	loginPayload := map[string]interface{}{
		"email":             req.Email,
		"password":          req.Password,
		"returnSecureToken": true,
	}

	// Marshal request payload into JSON
	payloadBytes, err := json.Marshal(loginPayload)
	if err != nil {
		log.Printf("Error marshalling login payload: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal error"})
		return
	}

	// Log the payload for debugging purposes
	log.Println("Payload Bytes:", string(payloadBytes))

	// Send HTTP request to Firebase
	resp, err := http.Post(
		"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="+firebaseAPIKey,
		"application/json",
		bytes.NewBuffer(payloadBytes),
	)
	if err != nil || resp.StatusCode != http.StatusOK {
		// Capture Firebase's response and log error details
		bodyBytes, _ := io.ReadAll(resp.Body)
		log.Printf("Firebase Error: %v", string(bodyBytes))

		// Send back Firebase error details in the response for debugging purposes
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Invalid credentials or Firebase error",
			"details": string(bodyBytes), // Return Firebase's error message
		})
		return
	}

	// Reset response body for decoding
	// resp.Body = io.NopCloser(bytes.NewReader(bodyBytes))

	// Decode Firebase response
	var firebaseResp struct {
		IDToken     string `json:"idToken"`
		Email       string `json:"email"`
		ExpiresIn   string `json:"expiresIn"`
		LocalID     string `json:"localId"` // Firebase UID
		DisplayName string `json:"displayName"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&firebaseResp); err != nil {
		log.Printf("Failed to decode Firebase response: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode Firebase response"})
		return
	}

	// Ensure valid ID token is returned
	if firebaseResp.IDToken == "" {
		log.Println("Firebase did not return a valid ID token")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials or Firebase error"})
		return
	}

	// Get user's role from local database using the email
	var user models.User
	if err := database.DB.Where("email = ?", firebaseResp.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not registered in local DB"})
		return
	}

	user.FCMToken = req.FCMToken
	if err := database.DB.Save(&user).Error; err != nil {
		log.Printf("Failed to update FCM token: %v", err)
		// Not fatal, continue login
	}

	// Return Firebase token + user role
	c.JSON(http.StatusOK, gin.H{
		"token":      firebaseResp.IDToken,
		"email":      firebaseResp.Email,
		"expires":    firebaseResp.ExpiresIn,
		"role":       user.Role,
		"firebaseid": user.FirebaseUID,
	})
}
