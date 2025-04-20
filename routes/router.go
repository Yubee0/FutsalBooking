package routes

import (
	"futsal-booking/database"
	"futsal-booking/routes/auth"
	"futsal-booking/routes/booking"
	"futsal-booking/routes/ground"
	"futsal-booking/routes/user"

	"github.com/gin-gonic/gin"
)

func SetupRouter(r *gin.Engine) {
	auth.SetupAuthRoutes(r)
	user.SetupUserRoutes(r, database.DB)
	booking.SetupBookingRoutes(r, database.DB)
	ground.SetUpGroundRoutes(r, database.DB)
}
