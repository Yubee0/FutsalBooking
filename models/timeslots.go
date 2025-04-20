package models

import "gorm.io/gorm"

type TimeSlot struct {
	gorm.Model
	GroundID  uint
	StartTime string
	EndTime   string
	Status    string
}
