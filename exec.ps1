docker build -t BuySellCars .
docker run --env-file .env -p 3005:3005 -it BuySellCars
