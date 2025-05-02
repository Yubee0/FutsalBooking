package handler

import (
	"futsal-booking/models"
	"futsal-booking/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AcceptOrDeclineBookingRequest(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the booking ID from URL params
		bookingID := c.Param("booking_id")
		status := c.DefaultQuery("status", "")

		// Validate status
		if status != "accepted" && status != "declined" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status. Use 'accepted' or 'declined'."})
			return
		}

		// Get user ID from context (owner)
		userID, exists := c.Get("Userid")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		// Fetch the booking request
		var booking models.BookingRequest
		if err := db.First(&booking, bookingID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Booking request not found"})
			return
		}

		// Ensure the booking is for a ground owned by the owner (user)
		if booking.GroundID != userID.(uint) {
			c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to update this booking request"})
			return
		}

		// Update the booking status
		booking.Status = status
		if err := db.Save(&booking).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update booking status"})
			return
		}

		// Fetch the user who made the booking request
		var user models.User
		if err := db.First(&user, booking.UserID).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user who made the booking"})
			return
		}

		// Send notification to the user who made the request
		if user.FCMToken != "" {
			var message string
			if status == "accepted" {
				message = "Your booking request has been accepted!"
			} else {
				message = "Your booking request has been declined."
			}
			go utils.SendFCMNotification(user.FCMToken, "Booking Request Status", message)
		}

		// Respond with success message
		c.JSON(http.StatusOK, gin.H{
			"message": "Booking request status updated successfully",
			"booking": booking,
		})
	}
}
