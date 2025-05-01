package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

// Returns list of time slot pairs as strings
func GenerateTimeSlots(opening, closing string, slotDuration int) ([][2]string, error) {
	layout := "15:04"

	start, err := time.Parse(layout, opening)
	if err != nil {
		return nil, fmt.Errorf("invalid opening time: %v", err)
	}

	end, err := time.Parse(layout, closing)
	if err != nil {
		return nil, fmt.Errorf("invalid closing time: %v", err)
	}

	if !start.Before(end) {
		return nil, fmt.Errorf("opening time must be before closing time")
	}

	var slots [][2]string
	for current := start; current.Add(time.Minute*time.Duration(slotDuration)).Before(end) || current.Add(time.Minute*time.Duration(slotDuration)).Equal(end); current = current.Add(time.Minute * time.Duration(slotDuration)) {
		from := current.Format(layout)
		to := current.Add(time.Minute * time.Duration(slotDuration)).Format(layout)
		slots = append(slots, [2]string{from, to})
	}

	return slots, nil
}

func SendFCMNotification(token, title, body string) {
	url := "https://fcm.googleapis.com/fcm/send"

	// Build the payload
	payload := map[string]interface{}{
		"to": token,
		"notification": map[string]string{
			"title": title,
			"body":  body,
		},
		"priority": "high",
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Failed to marshal FCM payload: %v", err)
		return
	}

	// Create HTTP request
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		log.Printf("Failed to create FCM request: %v", err)
		return
	}
	req.Header.Set("Content-Type", "application/json")

	// Get server key from environment variable (better than hardcoding)
	serverKey := os.Getenv("FIREBASE_SERVER_KEY")
	if serverKey == "" {
		log.Println("FIREBASE_SERVER_KEY environment variable not set")
		return
	}
	req.Header.Set("Authorization", "key="+serverKey)

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Failed to send FCM notification: %v", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Printf("FCM notification failed with status: %s", resp.Status)
	}
}
