package handler

import (
	"net/http"
	"time"

	"futsal-booking/models"
	"futsal-booking/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateBookingRequest(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			GroundID  uint   `json:"ground_id"`
			Date      string `json:"date"`       // format: 2025-04-04
			StartTime string `json:"start_time"` // format: 14:00
			EndTime   string `json:"end_time"`   // format: 15:00
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		// Parse and validate date
		dateParsed, err := time.Parse("2006-01-02", req.Date)
		if err != nil || !validTimeFormat(req.StartTime) || !validTimeFormat(req.EndTime) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date or time format"})
			return
		}

		// Get user ID from context
		userID, exists := c.Get("Userid")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		// Check slot availability
		isAvailable, err := models.IsSlotAvailable(db, req.GroundID, dateParsed, req.StartTime, req.EndTime)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
			return
		}
		if !isAvailable {
			c.JSON(http.StatusConflict, gin.H{"error": "Time slot not available"})
			return
		}

		// Create booking
		booking := models.BookingRequest{
			UserID:    userID.(uint),
			GroundID:  req.GroundID,
			Date:      dateParsed,
			StartTime: req.StartTime,
			EndTime:   req.EndTime,
			Status:    "pending",
		}

		if err := db.Create(&booking).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking"})
			return
		}

		// Fetch ground
		var ground models.Ground
		if err := db.First(&ground, booking.GroundID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Ground not found"})
			return
		}

		// Fetch ground owner
		var owner models.User
		if err := db.First(&owner, ground.OwnerID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Owner not found"})
			return
		}

		// Notify owner via FCM
		if owner.FCMToken != "" {
			go utils.SendFCMNotification(owner.FCMToken, "New Booking Request", "You have a new booking request.")
		}

		// Optionally notify the user as well
		var bookingUser models.User
		if err := db.First(&bookingUser, userID.(uint)).Error; err == nil {
			if bookingUser.FCMToken != "" {
				go utils.SendFCMNotification(bookingUser.FCMToken, "Booking Submitted", "Your request was submitted successfully.")
			}
		}

		// Respond
		c.JSON(http.StatusCreated, gin.H{
			"message": "Booking request created",
			"booking": booking,
		})
	}
}

func validTimeFormat(s string) bool {
	_, err := time.Parse("15:04", s)
	return err == nil
}
