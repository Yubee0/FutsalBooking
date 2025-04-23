package models

import (
	"gorm.io/gorm"
)

type TimeSlot struct {
	gorm.Model
	GroundID  uint
	Date      string `gorm:"type:date" json:"date"`
	StartTime string
	EndTime   string
	Status    string
}
