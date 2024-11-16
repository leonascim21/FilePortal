package db

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func NewMySQLStorage(dsn string) (*sql.DB, error) {
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	return db, nil
}
