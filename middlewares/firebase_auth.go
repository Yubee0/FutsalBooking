package middlewares

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strings"

	firebase "firebase.google.com/go"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/option"
	"gorm.io/gorm"

	"futsal-booking/models"
)

const (
	firebaseProjectID = "urbannepal-8eee0"
	allowedIssuers    = "https://securetoken.google.com/%s,https://identitytoolkit.google.com/"
	tokenAudience     = firebaseProjectID
)

func FirebaseAuthMiddleware(db *gorm.DB) gin.HandlerFunc {
	// Initialize Firebase with explicit configuration
	config := &firebase.Config{
		ProjectID: firebaseProjectID,
	}

	opt := option.WithCredentialsFile("urbannepal-8eee0-firebase-adminsdk-fbsvc-286b5ecd11.json")

	app, err := firebase.NewApp(context.Background(), config, opt)
	if err != nil {
		log.Fatalf("[FIREBASE INIT] Failed to initialize app: %v", err)
	}

	authClient, err := app.Auth(context.Background())
	if err != nil {
		log.Fatalf("[FIREBASE AUTH] Failed to get auth client: %v", err)
	}

	return func(c *gin.Context) {
		// Authorization header handling
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header"})
			return
		}

		idToken := strings.TrimPrefix(authHeader, "Bearer ")
		print(idToken)

		// Verify token with custom validation
		token, err := authClient.VerifyIDToken(context.Background(), idToken)
		if token != nil {
			print(token)

		}
		if token == nil {
			print("does not contain any token")

		}

		if err != nil {
			log.Printf("[TOKEN ERROR] Verification failed: %v", err)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid token",
				"hint":  "Token must be from Firebase Auth or Google Identity Toolkit",
			})
			return
		}

		// Custom issuer validation
		expectedFirebaseIssuer := fmt.Sprintf("https://securetoken.google.com/%s", firebaseProjectID)
		expectedGitIssuer := "https://identitytoolkit.google.com/"

		if token.Issuer != expectedFirebaseIssuer && token.Issuer != expectedGitIssuer {
			log.Printf("[ISSUER ERROR] Got: %s | Allowed: %s or %s",
				token.Issuer, expectedFirebaseIssuer, expectedGitIssuer)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error":   "Invalid token issuer",
				"details": fmt.Sprintf("Received issuer: %s", token.Issuer),
			})
			return
		}

		// Audience validation
		if token.Audience != firebaseProjectID {
			log.Printf("[AUDIENCE ERROR] Got: %s | Expected: %s",
				token.Audience, firebaseProjectID)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error":   "Invalid token audience",
				"details": fmt.Sprintf("Expected audience: %s", firebaseProjectID),
			})
			return
		}

		// Database operations with case-sensitive UID
		var user models.User
		result := db.Where("firebase_uid = ? ", token.UID).First(&user)

		if result.Error != nil {
			if errors.Is(result.Error, gorm.ErrRecordNotFound) {
				// Create new user with case-sensitive UID
				email, _ := token.Claims["email"].(string)
				newUser := models.User{
					FirebaseUID: token.UID, // Preserve exact case
					Email:       email,
					Role:        "user",
				}

				if err := db.Create(&newUser).Error; err != nil {
					log.Printf("[DB ERROR] User creation failed: %v", err)
					c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
						"error": "User registration failed",
					})
					return
				}
				user = newUser
			} else {
				log.Printf("[DB ERROR] Database error: %v", result.Error)
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
					"error": "Database operation failed",
				})
				return
			}
		}

		// Set context values
		c.Set("user", user)
		c.Set("Userid", user.ID)
		c.Set("authProvider", token.Issuer) // Track auth source
		c.Next()
	}
}
