package handler

import (
	"net/http"
	"time"

	"futsal-booking/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// POST /api/bookings
func CreateBooking(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			GroundID  uint   `json:"ground_id"`
			Date      string `json:"date"` // format: 2025-04-04
			Location  string `json:"location"`
			StartTime string `json:"start_time"` // format: 14:00
			EndTime   string `json:"end_time"`   // format: 15:00
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		// Parse date
		dateParsed, err := time.Parse("2006-01-02", req.Date)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
			return
		}

		// Optional: Validate time format (e.g., 24hr hh:mm)
		if !validTimeFormat(req.StartTime) || !validTimeFormat(req.EndTime) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid time format"})
			return
		}

		// Get user from context (from middleware)
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		// Check availability
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
		booking := models.Booking{
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

		c.JSON(http.StatusCreated, gin.H{"message": "Booking successful", "booking": booking})
	}
}

// simple validator for hh:mm
func validTimeFormat(t string) bool {
	_, err := time.Parse("15:04", t)
	return err == nil
}

// Check for time slot overlap
// func isSlotAvailable(db *gorm.DB, groundID uint, date time.Time, start string, end string) (bool, error) {
// 	var bookings []Booking
// 	err := db.Where("ground_id = ? AND date = ? AND status = ?", groundID, date, "approved").Find(&bookings).Error
// 	if err != nil {
// 		return false, err
// 	}

// 	layout := "15:04"
// 	reqStart, _ := time.Parse(layout, start)
// 	reqEnd, _ := time.Parse(layout, end)

// 	for _, b := range bookings {
// 		bStart, _ := time.Parse(layout, b.StartTime)
// 		bEnd, _ := time.Parse(layout, b.EndTime)

// 		// Check if requested slot overlaps with existing booking
// 		if reqStart.Before(bEnd) && reqEnd.After(bStart) {
// 			return false, nil
// 		}
// 	}
// 	return true, nil
// }
