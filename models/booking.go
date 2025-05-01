package models

import (
	"fmt"
	"time"

	"gorm.io/gorm"
)

type BookingRequest struct {
	ID        uint `gorm:"primaryKey"`
	GroundID  uint
	Ground    Ground
	UserID    uint
	User      User
	Date      time.Time
	StartTime string
	EndTime   string
	Status    string `gorm:"default:'pending'"` // pending, accepted, rejected
	CreatedAt time.Time
}

// Check for time slot overlap
func IsSlotAvailable(db *gorm.DB, groundID uint, date time.Time, start string, end string) (bool, error) {
	var bookings []BookingRequest
	err := db.Where("ground_id = ? AND date = ? AND status = ?", groundID, date, "approved").Find(&bookings).Error
	if err != nil {
		return false, err
	}

	layout := "15:04"
	reqStart, err := time.Parse(layout, start)
	if err != nil {
		return false, fmt.Errorf("invalid start time format")
	}

	reqEnd, err := time.Parse(layout, end)
	if err != nil {
		return false, fmt.Errorf("invalid end time format")
	}

	for _, b := range bookings {
		bStart, _ := time.Parse(layout, b.StartTime)
		bEnd, _ := time.Parse(layout, b.EndTime)

		// Check if requested slot overlaps with existing booking
		if reqStart.Before(bEnd) && reqEnd.After(bStart) {
			return false, nil
		}
	}
	return true, nil
}
