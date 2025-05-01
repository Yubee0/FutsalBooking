package handler

import (
	"context"
	"log"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/messaging"
	"google.golang.org/api/option"
)

func SendPushNotification(token string, messageBody string) {
	ctx := context.Background()

	// Initialize Firebase Admin SDK
	opt := option.WithCredentialsFile("urbannepal-8eee0-firebase-adminsdk-fbsvc-286b5ecd11.json")
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		log.Fatalf("Error initializing Firebase app: %v", err)
	}

	// Get the FCM client
	client, err := app.Messaging(ctx)
	if err != nil {
		log.Fatalf("Error getting FCM client: %v", err)
	}

	// Create the message
	message := &messaging.Message{
		Token: token, // The FCM registration token for the recipient
		Notification: &messaging.Notification{
			Title: "New Booking",
			Body:  messageBody, // e.g., booking details
		},
	}

	// Send the message
	response, err := client.Send(ctx, message)
	if err != nil {
		log.Fatalf("Error sending FCM message: %v", err)
	}

	log.Printf("Successfully sent message: %s", response)
}
