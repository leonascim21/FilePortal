package user

import (
	"FilePortal/cmd/types"
	"FilePortal/cmd/utils"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
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
	r.HandleFunc("/validate-token", h.validateTokenHandler).Methods("GET")
	r.HandleFunc("/upload", h.uploadFileHandler).Methods("POST")
	r.HandleFunc("/files", h.getUserFilesHandler).Methods("GET")
	r.HandleFunc("/delete", h.deleteFileHandler).Methods("DELETE")
}

func (h *Handler) loginHandler(w http.ResponseWriter, r *http.Request) {
	var payload types.LoginUserPayload
	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	pw, err := h.store.GetUserPasswordByEmail(payload.Email)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("user with email %s does not exist", payload.Email))
	}

	err = bcrypt.CompareHashAndPassword([]byte(pw), []byte(payload.Password))
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("invalid credentials"))
		return
	}

	token, err := utils.GenerateJWT(payload.Email)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("failed to generate token"))
		return
	}

	utils.WriteJSON(w, http.StatusAccepted, map[string]string{"token": token})
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

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(payload.Password), bcrypt.DefaultCost)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("failed to hash password: %v", err))
		return
	}

	err = h.store.CreateUser(types.User{
		FirstName: payload.FirstName,
		LastName:  payload.LastName,
		Email:     payload.Email,
		Password:  string(hashedPassword),
		CreatedAt: time.Now(),
	})

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusCreated, map[string]string{"message": "User registered!"})
}

func (h *Handler) validateTokenHandler(w http.ResponseWriter, r *http.Request) {
	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	jwtSecret := []byte(os.Getenv("JWT_SECRET"))
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) uploadFileHandler(w http.ResponseWriter, r *http.Request) {

	user, err := utils.GetAuthenticatedUser(r, h.store)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	//max 10mb file upload
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "Invalid file upload", http.StatusBadRequest)
		return
	}

	file, handler, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "File retrieval failed", http.StatusBadRequest)
		return
	}
	defer file.Close()

	uploader := utils.NewSpacesUploader()
	fileURL, err := uploader.UploadFile(file, handler.Filename)
	if err != nil {
		http.Error(w, "File upload failed", http.StatusInternalServerError)
		return
	}

	err = h.store.SaveFile(types.File{
		UserID:     user.ID,
		FileName:   handler.Filename,
		FileURL:    fileURL,
		UploadedAt: time.Now(),
	})
	if err != nil {
		http.Error(w, "Failed to save file metadata.", http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{"url": fileURL})
}

func (h *Handler) getUserFilesHandler(w http.ResponseWriter, r *http.Request) {
	user, err := utils.GetAuthenticatedUser(r, h.store)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	files, err := h.store.GetFilesByUserID(user.ID)
	if err != nil {
		http.Error(w, "Failed to retrieve files.", http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusOK, files)
}

func (h *Handler) deleteFileHandler(w http.ResponseWriter, r *http.Request) {
	user, err := utils.GetAuthenticatedUser(r, h.store)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	fileID := r.URL.Query().Get("id")
	if fileID == "" {
		http.Error(w, "Missing file ID.", http.StatusBadRequest)
		return
	}

	file, err := h.store.GetFileByID(fileID)
	if err != nil {
		http.Error(w, "File not found.", http.StatusNotFound)
		return
	}

	if file.UserID != user.ID {
		http.Error(w, "No permission to delete this file.", http.StatusForbidden)
		return
	}

	uploader := utils.NewSpacesUploader()
	_, err = uploader.DeleteFile(file.FileName)
	if err != nil {
		http.Error(w, "Failed to delete file", http.StatusInternalServerError)
		return
	}

	err = h.store.DeleteFileByID(fileID)
	if err != nil {
		http.Error(w, "Failed to delete file metadata.", http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{"message": "File deleted successfully."})
}
