package models

import "time"

type Ground struct {
	ID           uint   `gorm:"primaryKey"`
	Name         string `gorm:"not null"`
	Location     string
	Description  string
	OwnerID      uint // FK to User
	CreatedAt    time.Time
	UpdatedAt    time.Time
	OpeningTime  string `json:"opening_time"`  // e.g., "08:00"
	ClosingTime  string `json:"closing_time"`  // e.g., "17:00"
	SlotDuration int    `json:"slot_duration"` // minutes, e.g., 60

}
