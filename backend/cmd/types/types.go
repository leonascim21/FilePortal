package types

import "time"

// Interface b/c they're easy to test in Go
// The implementation of this is in store.go - that's how dependency injection works in Go
// Structs have data, interfaces have implementation
type UserStore interface {
	GetUserByEmail(email string) (*User, error)
	GetUserByID(id int) (*User, error)
	CreateUser(User) error
	GetUserPasswordByEmail(email string) (string, error)
	SaveFile(file File) error
}

type LoginUserPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterUserPayload struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

type User struct {
	ID        int       `json:"id"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	CreatedAt time.Time `json:"createdAt"`
}

type File struct {
	ID         int
	UserID     int
	FileName   string
	FileURL    string
	UploadedAt time.Time
}
