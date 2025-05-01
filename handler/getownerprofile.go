package handler

import (
	"futsal-booking/database"
	"futsal-booking/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetOwnerProfile(c *gin.Context) {
	firebaseUID := c.Param("firebase_uid")

	// Step 1: Find owner from firebase_uid
	var owner models.User
	if err := database.DB.Where("firebase_uid = ? AND role = ?", firebaseUID, "owner").First(&owner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Owner not found"})
		return
	}

	// Step 2: Get grounds with user_id == owner.ID
	var grounds []models.Ground
	if err := database.DB.Where("owner_id = ?", owner.ID).Find(&grounds).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch grounds"})
		return
	}

	// Step 3: Get pending booking requests
	var bookingRequests []models.BookingRequest
	if err := database.DB.Where("ground_id IN ? AND status = ?", getGroundIDs(grounds), "pending").Find(&bookingRequests).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch booking requests"})
		return
	}

	// Step 4: Return combined response
	c.JSON(http.StatusOK, gin.H{
		"owner": gin.H{
			"id":           owner.ID,
			"name":         owner.Name,
			"email":        owner.Email,
			"phone":        owner.Phone,
			"firebase_uid": owner.FirebaseUID,
		},
		"grounds":          grounds,
		"booking_requests": bookingRequests,
	})
}

func getGroundIDs(grounds []models.Ground) []uint {
	groundIDs := make([]uint, len(grounds))
	for i, ground := range grounds {
		groundIDs[i] = ground.ID
	}
	return groundIDs
}
