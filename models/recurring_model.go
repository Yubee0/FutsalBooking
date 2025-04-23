package models

import (
	"time"
)

type RecurringReservation struct {
	ID        uint `gorm:"primaryKey"`
	GroundID  uint
	Weekday   int
	StartTime string
	EndTime   string
	CreatedAt time.Time
}
