package utils

import (
	"fmt"
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
