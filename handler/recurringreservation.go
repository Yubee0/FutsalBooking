package handler

import (
	"futsal-booking/database"
	"futsal-booking/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateRecurringReservation(c *gin.Context) {
	groundID := c.Param("id")
	var ground models.Ground
	if err := database.DB.First(&ground, groundID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ground not found"})
		return
	}

	var req struct {
		Weekday   int    `json:"weekday"`    // 0-6: Sunday-Saturday
		StartTime string `json:"start_time"` // "08:00"
		EndTime   string `json:"end_time"`   // "09:00"
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	layout := "15:04"
	start, err1 := time.Parse(layout, req.StartTime)
	end, err2 := time.Parse(layout, req.EndTime)

	if err1 != nil || err2 != nil || !start.Before(end) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid time range"})
		return
	}

	reservation := models.RecurringReservation{
		GroundID:  ground.ID,
		Weekday:   req.Weekday,
		StartTime: req.StartTime,
		EndTime:   req.EndTime,
	}

	if err := database.DB.Create(&reservation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create recurring reservation"})
		return
	}

	// Update matching time slots to 'reserved'
	var slots []models.TimeSlot
	if err := database.DB.
		Where("ground_id = ? AND EXTRACT(DOW FROM date) = ? AND start_time = ? AND end_time = ? AND status = ?",
			ground.ID, req.Weekday, req.StartTime, req.EndTime, "available").
		Find(&slots).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query time slots"})
		return
	}

	// Mark as reserved
	if len(slots) > 0 {
		if err := database.DB.Model(&models.TimeSlot{}).
			Where("id IN (?)", getSlotIDs(slots)).
			Update("status", "reserved").Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reserve time slots"})
			return
		}
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Recurring reservation created", "data": reservation})
}

func getSlotIDs(slots []models.TimeSlot) []uint {
	ids := make([]uint, len(slots))
	for i, slot := range slots {
		ids[i] = slot.ID
	}
	return ids
}
