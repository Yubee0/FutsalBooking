package auth

import (
	"futsal-booking/handler"

	"github.com/gin-gonic/gin"
)

// SetupAuthRoutes sets up the routes for authentication actions (login and register)
func SetupAuthRoutes(r *gin.Engine) {
	authGroup := r.Group("/api/auth") // Route group for authentication
	{
		authGroup.POST("/register", handler.Register) // Register route
		authGroup.POST("/login", handler.Login)       // Login route
	}
}
