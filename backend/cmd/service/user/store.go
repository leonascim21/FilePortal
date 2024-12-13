package user

import (
	"FilePortal/cmd/types"
	"database/sql"
	"errors"
	"fmt"
	"log"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	if db == nil {
		log.Fatal("Database connection is nil")
	}
	return &Store{db: db}
}

func scanRowIntoUser(rows *sql.Rows) (*types.User, error) {
	user := new(types.User)

	err := rows.Scan(
		&user.ID,
		&user.FirstName,
		&user.LastName,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *Store) GetUserByEmail(email string) (*types.User, error) {
	log.Println("Getting user by email")
	rows, err := s.db.Query("SELECT * FROM users WHERE email = ?", email)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	u := new(types.User)

	/*
		if !rows.Next() { // Check if there are any rows in the result
			return nil, errors.New("user not found") // No rows found, return "user not found" error
		}
	*/

	for rows.Next() {
		u, err = scanRowIntoUser(rows)
		if err != nil {
			return nil, err
		}
	}

	if u.ID == 0 {
		return nil, errors.New("user not found")
	}

	return u, nil

}

func (s *Store) GetUserByID(id int) (*types.User, error) {
	return nil, nil
}

func (s *Store) CreateUser(user types.User) error {
	query := "INSERT INTO users (first_name, last_name, email, password, created_at) VALUES (?, ?, ?, ?, ?)"

	_, err := s.db.Exec(query, user.FirstName, user.LastName, user.Email, user.Password, user.CreatedAt)
	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	return nil
}

func (s *Store) GetUserPasswordByEmail(email string) (string, error) {
	var password string

	// Query to select the password where the email matches
	query := "SELECT password FROM users WHERE email = ?"
	err := s.db.QueryRow(query, email).Scan(&password)

	if err != nil {
		if err == sql.ErrNoRows {
			return "", fmt.Errorf("user not found")
		}
		return "", fmt.Errorf("failed to fetch password: %w", err)
	}

	return password, nil
}

func (s *Store) SaveFile(file types.File) error {
	query := "INSERT INTO files (user_id, file_name, file_url, uploaded_at) VALUES (?, ?, ?, ?)"
	_, err := s.db.Exec(query, file.UserID, file.FileName, file.FileURL, file.UploadedAt)
	if err != nil {
		return fmt.Errorf("failed to save file: %w", err)
	}
	return nil
}
