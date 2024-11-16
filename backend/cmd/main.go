package main

import (
	"FilePortal/cmd/api"
	"FilePortal/cmd/db"
	"database/sql"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		return
	}
	dsn := os.Getenv("DB_DSN")

	database, err := db.NewMySQLStorage(dsn)
	if err != nil {
		log.Fatal(err)
	}

	initStorage(database)

	serv1 := api.NewServer(":8080", database)
	if err := api.ServerRun(serv1); err != nil {
		log.Fatal(err)
	}
}

func initStorage(db *sql.DB) {
	err := db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	log.Println("DB Successfully Connected!")
}
