/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, createHandlerBoundToURL, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import {
  pageCache,
  imageCache,
  staticResourceCache,
  googleFontsCache
} from 'workbox-recipes';


// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
let WEB_MANIFEST = self.__WB_MANIFEST
/*WEB_MANIFEST.push({
  url: "/offline.html",

  revision: '1234567890',
})
*//*
WEB_MANIFEST.push({
  url: process.env.PUBLIC_URL + "/img/placeholders/NoInternet.svg",
  revision: '123454367892',
})
WEB_MANIFEST.push({
  url: "/error/NoInternet",
  revision: '1234567891',
})*/
/*WEB_MANIFEST.push({
  url: "offline.html", // in Public
  revision: '1234567891',
})*/



cleanupOutdatedCaches();

precacheAndRoute(WEB_MANIFEST);


clientsClaim();

pageCache();

googleFontsCache();

staticResourceCache();

imageCache();



// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false;
    } // If this is a URL that starts with /_, skip.

    if (url.pathname.startsWith('/_')) {
      return false;
    } // If this looks like a URL for a resource, because it contains // a file extension, skip.

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    } // Return true to signal that we want to use the handler.

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
/*registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'), // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);*/

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('notificationclick', function (event) {
  //console.log('SW notification click event', event)
  const url = event?.notification?.data?.FCM_MSG?.notification?.data?.click_action || event?.notification?.data?.click_action;
  console.log("URL: ", url)
  if (url /*&& url !== ""*/) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(windowClients => {
        // Check if there is already a window/tab open with the target URL
        for (var i = 0; i < windowClients.length; i++) {
          var client = windowClients[i];
          // If so, just focus it.
          if (client.url === url && 'focus' in client) {
            return client.focus();
          } else if (client.url.startsWith() && 'navigate' in client) {
            return client.navigate(url);
          }
        }
        // If not, then open the target URL in a new window/tab.
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
  //let action = event.action; --> AZIONI
  event.notification.close();

})

// Any other custom service worker logic can go here.
importScripts('https://www.gstatic.com/firebasejs/8.2.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.4/firebase-messaging.js');

// ? https://stackoverflow.com/questions/42964547/uncaught-firebaseerror-messaging-this-method-is-available-in-a-window-context
// ? https://stackoverflow.com/questions/46043818/get-firebase-web-notification-even-close-chrome
// ? https://developer.mozilla.org/en-US/docs/Web/API/WindowClient/focus
firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,//"pern-boilerplate.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSANGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
});




const messaging = firebase.messaging();
//* https://stackoverflow.com/questions/40277900/how-to-get-push-message-events-like-click-close-show-with-firebase-cloud-messagi





/*messaging.onBackgroundMessage(async (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  self.registration.showNotification("Background" + payload.notification.title, payload.notification)
})*/
//self.skipWaiting();

// Quest serve SOLO se voglio mendare solo dati (tipo chat)
// messaging.setBackgroundMessageHandler (function(payload) {

//   console.log('[firebase-messaging-sw.js] Received background message ', payload);

//    /*const data = payload.data;
//    const notificationTitle = data.title;*/
//    const notificationOptions = {
//       title: "aSDasdasd",
//       body: "Asdasdasd",

//       body: data.body
//    };

//     return self.registration.showNotification ("AAAAAAAAAAAAAAAAAAA",  notificationOptions);
//   });

// self.addEventListener('message', function (event) {
//   console.debug("[SERVICE WORKER] message", event);
//   const notification = e.notification;
//   const data = notification.data || {};

//   var options = {
//     ...notification,
//     data,
//   };
//   event.waitUntil(
//     self.registration.showNotification(body.notification.title, options)
//   );

// })



//self.addEventListener('notificationclose', function (e) {
//  //console.debug("[SERVICE WORKER] Closed notification", e);
//  //var notification = e.notification;
//  //var data = notification.data || {};
//  console.log("[SERVICE WORKER] notificationclose: ", e)
//});
////
//self.addEventListener("notificationclick", function (e) {
//  console.log("[SERVICE WORKER] Clicked notification: ", e);
//  var notification = e.notification;
//  var data = notification.data || {};
//  let url = data.url
//
//  e.waitUntil(
//    clients.matchAll({ type: 'window' }).then(windowClients => {
//      // Check if there is already a window/tab open with the target URL
//      for (var i = 0; i < windowClients.length; i++) {
//        var client = windowClients[i];
//        // If so, just focus it.
//        if (client.url === url && 'focus' in client) {
//          return client.focus();
//        } else if (client.url.startsWith() && 'navigate' in client) {
//          return client.navigate(url);
//        }
//      }
//      // If not, then open the target URL in a new window/tab.
//      if (clients.openWindow) {
//        return clients.openWindow(url);
//      }
//    })
//  );
//
//  //let action = e.action; --> AZIONI
//  notification.close();
//});
//
/*self.addEventListener('push', function(e) {
    //self.registration.hideNotification();
    //console.log(self.registration)
    /*
    try{
      let body = null
      if(e.data){
          body = e.data.json()
      }else{
        return;
      }

      console.log("[FIREBASE PUSH NOTIFICATIONS] Arrivata notifica", body)

      var options = {
        body: body.notification.body,
        icon: body.notification.icon,
        data: body,
        vibrate: [100, 50, 100],
        actions: [
          {action: 'explore', title: 'View',},
          {action: 'close', title: 'Close'},
        ]
      };
      e.waitUntil(
        self.registration.showNotification(body.notification.title, options)
      );
    }catch(exception){
      console.error("[FIREBASE PUSH NOTIFICATIONS]", exception)
    }
    return null;
  });*/
  //firebase.messaging()