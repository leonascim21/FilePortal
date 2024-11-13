package api

import (
	"FilePortal/cmd/service/user"
	"database/sql"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type Server struct {
	address string
	db      *sql.DB
}

func NewServer(add string, db *sql.DB) *Server {
	return &Server{
		address: add,
		db:      db,
	}
}

func ServerRun(server *Server) error {
	r := mux.NewRouter()

	userStore := user.NewStore(server.db)
	userHandler := user.NewHandler(userStore)
	userHandler.RegisterRoutes(r)

	log.Println("Listening on: ", server.address)
	return http.ListenAndServe(server.address, r)
}
