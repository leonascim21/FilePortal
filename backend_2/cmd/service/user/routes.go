package user

import (
	"FilePortal/cmd/types"
	"FilePortal/cmd/utils"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

// Each service is of type Handler - it can have whatever dependencies we'd like
type Handler struct {
	store types.UserStore
}

func NewHandler(store types.UserStore) *Handler {
	return &Handler{store: store}
}

func (h *Handler) RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/login", h.loginHandler).Methods("POST")
	r.HandleFunc("/register", h.registerHandler).Methods("POST")
}

func (h *Handler) loginHandler(w http.ResponseWriter, r *http.Request) {
	var payload types.LoginUserPayload
	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
	}

	pw, err := h.store.GetUserPasswordByEmail(payload.Email)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("user with email %s does not exist", payload.Email))
	}

	if payload.Password != pw {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("wrong password"))
	}

}

func (h *Handler) registerHandler(w http.ResponseWriter, r *http.Request) {
	// get JSON payload
	var payload types.RegisterUserPayload
	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
	}

	log.Printf("User email: %s", payload.Email)
	u, err := h.store.GetUserByEmail(payload.Email)

	if u != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("user with email %s already exists", payload.Email))
		return
	}

	err = h.store.CreateUser(types.User{
		FirstName: payload.FirstName,
		LastName:  payload.LastName,
		Email:     payload.Email,
		Password:  payload.Password,
		CreatedAt: time.Now(),
	})

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusCreated, map[string]string{"message": "User registered!"})
}
