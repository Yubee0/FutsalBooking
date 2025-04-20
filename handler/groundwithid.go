package handler

import (
	"futsal-booking/database"
	"futsal-booking/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetGroundDetails(c *gin.Context) {
	// Get the ground ID from the URL parameter
	groundID := c.Param("ground_id")

	var ground models.Ground
	var slots []models.TimeSlot

	// Fetch the ground details using ground ID
	if err := database.DB.Where("id = ?", groundID).First(&ground).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ground not found"})
		return
	}

	// Fetch the time slots for the ground
	if err := database.DB.Where("ground_id = ?", groundID).Find(&slots).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch time slots"})
		return
	}

	// Include status for each time slot (assuming `status` is a field in the TimeSlot model)
	// If you don't have a `status` field, you can modify this logic based on your requirements.

	// Prepare the response
	c.JSON(http.StatusOK, gin.H{
		"ground": ground,
		"slots":  slots,
	})
}

// func GetGrounds(c *gin.Context) {
// 	var grounds []models.Ground

// 	if err := database.DB.Find(&grounds).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch grounds from database"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"Availablegrounds": grounds})
// }
