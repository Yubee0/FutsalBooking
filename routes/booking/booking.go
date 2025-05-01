package booking

import (
	"futsal-booking/database"
	"futsal-booking/handler"
	"futsal-booking/middlewares"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupBookingRoutes(r *gin.Engine, db *gorm.DB) {
	bookingGroup := r.Group("/api/bookings")
	bookingGroup.Use(middlewares.FirebaseAuthMiddleware(database.DB))
	{
		bookingGroup.POST("", handler.CreateBookingRequest(db))
	}
}
