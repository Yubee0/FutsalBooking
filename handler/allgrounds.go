package handler

import (
	"futsal-booking/database"
	"futsal-booking/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetGrounds(c *gin.Context) {
	var grounds []models.Ground

	if err := database.DB.Find(&grounds).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch grounds from database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Availablegrounds": grounds})
}
