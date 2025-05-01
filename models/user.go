package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	FirebaseUID string `gorm:"uniqueIndex"`
	Email       string
	Role        string `gorm:"default:user"`
	Name        string
	Phone       string
	FCMToken    string `gorm:"column:fcm_token"`
}
