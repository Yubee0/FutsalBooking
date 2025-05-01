package handler

import (
	"futsal-booking/database"
	"futsal-booking/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetOwnerProfile(c *gin.Context) {
	ownerIDParam := c.Param("owner_id")

	// Convert ownerID from string to uint
	ownerID, err := strconv.ParseUint(ownerIDParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid owner ID"})
		return
	}

	// Step 1: Find owner by ID and role
	var owner models.User
	if err := database.DB.Where("id = ? AND role = ?", ownerID, "owner").First(&owner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Owner not found"})
		return
	}

	// Step 2: Get grounds with owner_id == owner.ID
	var grounds []models.Ground
	if err := database.DB.Where("owner_id = ?", owner.ID).Find(&grounds).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch grounds"})
		return
	}

	// Step 3: Return combined response
	c.JSON(http.StatusOK, gin.H{
		"owner": gin.H{
			"id":           owner.ID,
			"name":         owner.Name,
			"email":        owner.Email,
			"phone":        owner.Phone,
			"firebase_uid": owner.FirebaseUID,
		},
		"grounds": grounds,
	})
}
