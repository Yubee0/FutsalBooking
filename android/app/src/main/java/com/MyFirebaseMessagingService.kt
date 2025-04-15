package com.futsalbooking

import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class MyFirebaseMessagingService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        // Send token to your server
        println("FCM Token: $token")
    }

    override fun onMessageReceived(message: RemoteMessage) {
        // Handle notifications here
        message.notification?.let {
            println("Received notification: ${it.title} - ${it.body}")
        }
    }
}