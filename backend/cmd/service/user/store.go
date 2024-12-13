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

func (s *Store) GetFilesByUserID(userID int) ([]types.File, error) {
	query := "SELECT id, user_id, file_name, file_url, uploaded_at FROM files WHERE user_id = ?"
	rows, err := s.db.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query files: %w", err)
	}
	defer rows.Close()

	var files []types.File
	for rows.Next() {
		var file types.File
		err := rows.Scan(&file.ID, &file.UserID, &file.FileName, &file.FileURL, &file.UploadedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan file row: %w", err)
		}
		files = append(files, file)
	}

	return files, nil
}

func (s *Store) GetFileByID(fileID string) (*types.File, error) {
	query := "SELECT id, user_id, file_name, file_url, uploaded_at FROM files WHERE id = ?"
	row := s.db.QueryRow(query, fileID)

	var file types.File
	err := row.Scan(&file.ID, &file.UserID, &file.FileName, &file.FileURL, &file.UploadedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("file not found")
		}
		return nil, fmt.Errorf("failed to retrieve file: %w", err)
	}
	return &file, nil
}

func (s *Store) DeleteFileByID(fileID string) error {
	query := "DELETE FROM files WHERE id = ?"
	_, err := s.db.Exec(query, fileID)
	if err != nil {
		return fmt.Errorf("failed to delete file: %w", err)
	}
	return nil
}

func (s *Store) ShareFile(fileID, userID int) error {
	query := "INSERT INTO file_shares (file_id, user_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE shared_at = CURRENT_TIMESTAMP"
	_, err := s.db.Exec(query, fileID, userID)
	if err != nil {
		return fmt.Errorf("failed to share file: %w", err)
	}
	return nil
}

func (s *Store) GetSharedFiles(userID int) ([]types.File, error) {
	query := `
        SELECT f.id, f.user_id, f.file_name, f.file_url, f.uploaded_at
        FROM files f
        INNER JOIN file_shares fs ON f.id = fs.file_id
        WHERE fs.user_id = ?`
	rows, err := s.db.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch shared files: %w", err)
	}
	defer rows.Close()

	var files []types.File
	for rows.Next() {
		var file types.File
		err := rows.Scan(&file.ID, &file.UserID, &file.FileName, &file.FileURL, &file.UploadedAt)
		if err != nil {
			return nil, err
		}
		files = append(files, file)
	}

	return files, nil
}
