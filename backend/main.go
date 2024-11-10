package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	httpPort := 8080

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		_, err := fmt.Fprintf(w, "You requested %s\n", r.URL.Path)
		if err != nil {
			log.Printf("Error Returning Response: %v\n", err.Error())
			http.Error(w, fmt.Sprintf("Internal Server Error: %v", err.Error()), http.StatusInternalServerError)
		}
	})

	err := http.ListenAndServe(fmt.Sprintf(":%d", httpPort), nil)
	if err != nil {
		log.Fatalf("Error starting server: %s", err)
	}
}
