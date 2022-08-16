# Weather App

This is my version of the cool weather app. It is not a completely finished product but it should satisfy most of the mentioned features from the original README.md.  

## Prerequisites
* Docker and docker-compose installed on your machine, that's it!

## How to run
1. Run command line command `docker-compose up -d`
2. The service is now up and running!
    - Backend is now running in http://localhost:9000
    - And demo frontend in http://localhost:8000
3. Once you try to open http://localhost:8000 on your browser you get a prompt asking you to "Allow it to know your location" and press "Allow". This makes sure it geolocation functions properly. (Without geolocation the default is Finland, Helsinki)

<img src="./img/allowlocation.png" alt= "img"  width="400">


## Full Page example
<img src="./img/example.png" alt= "img"  width="700">

## NB!
* The update button did not work when I forked the repo. I tried to make it work too, but I eventually left it as it is
* Wanted to maybe add textbox where you can apply your selected country you wanted to know the weather of, but due to the update function not working properly it got dropped.