![La postiterie](http://debaser.fr/Postiterie.png)

You can visit the Postiterie at this url : http://debaser.fr/postiterie
(keep in mind we need https in order to access the phone camera :/)

### Site informatif 

[More details on our website (french only)](https://postiterie.wordpress.com/)

![La postiterie](http://debaser.fr/La_Postiterie2.png)

## Before running 

In order to use google drive api, you'll require credentials.

To get them you need to go to https://console.cloud.google.com/apis/dashboard and create an app by selecting the Google Drive Api. Then you'll need to select browser app, and specify source and redirect url (this app uses localhost:8080 by default) then you have to create the credentials : an api key and a client which you'll be able to get the id of

then add a file named `.env.local` in the root folder with these 2 lines (these are fake, use yours) :

```
VUE_APP_API_KEY=AIaDyCp7-1deE8KGorrOce7toVfdBhiDXhs-sM
VUE_APP_CLIENT_ID=11111134087842-7babrj6q1uronhdndr2a5fj6lv6m5cff.apps.googleusercontent.com
```

once you've done that, you must still set-up the mailing system, for that you have to go to https://www.smtpjs.com/ and encrypt your smtp credentials. This will give you a token, then simply add these 2 lines to `.env.local` (with your email and your token)

```
VUE_APP_SMTP_EMAIL=postiterie@gmail.com 
VUE_APP_SMTP_TOKEN=5fake624d8-2b8a-4492-b37a-a7feebb02152
```

Once you've done, that you're ready for next step!

## Running the project

### Don't forget to install depedencies
```
npm install
```

### Then you can run the project on `localhost:8080`
```
npm run serve
```

### Or you can build the project to use it on your own domain by running 
```
npm run build
```
you'll find the result in the `dist` folder
