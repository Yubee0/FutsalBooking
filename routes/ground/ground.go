package ground

import (
	"futsal-booking/database"
	"futsal-booking/handler"
	"futsal-booking/middlewares"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetUpGroundRoutes(r *gin.Engine, db *gorm.DB) {
	// Remove middleware from Group() params
	groundGroup := r.Group("/api/ground")
	// Apply middleware once
	groundGroup.Use(middlewares.FirebaseAuthMiddleware(database.DB))
	{
		groundGroup.POST("/create-ground", handler.CreateGround)
		groundGroup.GET("/get-grounds", handler.GetGrounds)
		groundGroup.GET("/get-grounds/:ground_id", handler.GetGroundDetails)
		groundGroup.POST("/:id/recurring-reservation", handler.CreateRecurringReservation)
	}
}
