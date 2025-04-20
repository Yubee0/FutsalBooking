package handler

import (
	"net/http"
	"time"

	"futsal-booking/database"
	"futsal-booking/models"

	"github.com/gin-gonic/gin"
)

func CreateGround(c *gin.Context) {
	u, exist := c.Get("user")
	if !exist {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	user := u.(models.User) // type assertion

	var req struct {
		Name        string `json:"name"`
		Location    string `json:"location"`
		Description string `json:"description"`
		StartTime   string `json:"start-time"` // "14:00"
		EndTime     string `json:"end-time"`   // "20:00"
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Parse opening and closing time
	layout := "15:04"
	start, err := time.Parse(layout, req.StartTime)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start time format"})
		return
	}
	end, err := time.Parse(layout, req.EndTime)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end time format"})
		return
	}
	if !start.Before(end) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Start time must be before end time"})
		return
	}

	// Create ground
	ground := models.Ground{
		Name:        req.Name,
		Location:    req.Location,
		Description: req.Description,
		OwnerID:     user.ID,
		OpeningTime: req.StartTime,
		ClosingTime: req.EndTime,
	}
	if err := database.DB.Create(&ground).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create ground"})
		return
	}

	// Generate 1-hour time slots
	slots := []models.TimeSlot{}
	for t := start; t.Add(time.Hour).Equal(end) || t.Add(time.Hour).Before(end); t = t.Add(time.Hour) {
		slot := models.TimeSlot{
			GroundID:  ground.ID,
			StartTime: t.Format(layout),
			EndTime:   t.Add(time.Hour).Format(layout),
			Status:    "available",
		}
		slots = append(slots, slot)
	}

	if len(slots) > 0 {
		if err := database.DB.Create(&slots).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create time slots"})
			return
		}
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Ground and time slots created successfully",
		"ground":  ground,
		"slots":   slots,
	})
}
