package user

import (
	"futsal-booking/database"
	"futsal-booking/handler"
	"futsal-booking/middlewares"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// SetupUserRoutes sets up the routes for user profile actions
func SetupUserRoutes(r *gin.Engine, db *gorm.DB) {
	userGroup := r.Group("/api/user")
	userGroup.Use(middlewares.FirebaseAuthMiddleware(database.DB)) // Secure routes
	{
		// Pass db to the handler function for GetProfile
		userGroup.GET("/me", handler.GetProfile(db))
		userGroup.GET("/:owner_id/ownerprofile", handler.GetOwnerProfile)
	}
}
