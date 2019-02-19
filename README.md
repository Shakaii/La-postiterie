# La postiterie



### Site informatif 

[More details on our website (french only)](https://postiterie.wordpress.com/)

![La postiterie](http://debaser.fr/La_Postiterie.png)

### 

## Before running 

In order to use google drive api, you'll require credentials.

To get them you need to go to https://console.cloud.google.com/apis/dashboard and create an app by selecting the Google Drive Api. Then you'll need to select browser app, and specify source and redirect url (this app uses localhost:8080 by default) then you have to create the credentials : an api key and a client which you'll be able to get the id of

then add a file name .env.local in the root folder with these 2 lines (these are fake, use yours) :

```
VUE_APP_API_KEY=AIaDyCp7-1deE8KGorrOce7toVfdBhiDXhs-sM
VUE_APP_CLIENT_ID=11111134087842-7babrj6q1uronhdndr2a5fj6lv6m5cff.apps.googleusercontent.com
```
Once you've done, that you're good to go !

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
