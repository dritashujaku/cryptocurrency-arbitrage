# Cryptocurrency Arbitrage Server

The project's backend developed in Python 3.8 using [FastAPI](https://github.com/tiangolo/fastapi) and [odmantic](https://github.com/art049/odmantic).

## Setup

To run the project first activate the virtual environment
```
$ .\venv\Scripts\activate
```
Now install the requirements from requirements.txt file in the terminal with:
```
$ pip install -r requirements.txt
```
Start the app on port 9004
```
$ uvicorn app.main:app --reload --port 9004
```
If you want to run it on another port, change the API_URL defined at the client as well.

For the database to work set the environment variable MONGODB_URI with the mongo connection string as its value, e.g.:
```
MONGODB_URI
mongodb+srv://name:passwordM@cluster0.5jtoj.mongodb.net/cryptoarbitrage?retryWrites=true&w=majority
```