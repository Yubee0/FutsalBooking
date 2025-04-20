package models

import (
	"fmt"
	"time"

	"gorm.io/gorm"
)

type Booking struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null"`
	GroundID  uint      `gorm:"not null"`
	Date      time.Time `gorm:"not null"`
	StartTime string    `gorm:"type:varchar(5)"`
	EndTime   string    `gorm:"type:varchar(5)"`
	Status    string    `gorm:"default:'pending'"`
	CreatedAt time.Time `gorm:"<-:create"`
}

// Check for time slot overlap
func IsSlotAvailable(db *gorm.DB, groundID uint, date time.Time, start string, end string) (bool, error) {
	var bookings []Booking
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
