package data_model

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"io"
	"log"
	"net/http"
	"strconv"
)

type Comment struct {
	gorm.Model

	DestinationID     int 	`json:"destination_id" validate:"required"`
	UserID     	int 	`json:"user_id""`
	Username    string  `json:"username"`
	Text    	string  `json:"text" validate:"required"`
}

type Comments []*Comment

func (c *Comment) FromJSON(r io.Reader) error {
	e := json.NewDecoder(r)
	return e.Decode(c)
}

func (c *Comment) ToJSON(w io.Writer) error {
	e := json.NewEncoder(w)
	return e.Encode(c)
}

func (c *Comment) Validate() error {
	validate := validator.New()
	return validate.Struct(c)
}

func (c *Comments) ToJSON(w io.Writer) error {
	e := json.NewEncoder(w)
	return e.Encode(c)
}

func GetComments(id int) (Comments, error) {
	db, err = gorm.Open("postgres", "host=host.docker.internal port=5432 user=postgres dbname=go_booking_ratings_comments sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfully connected to database!")
	}
	defer db.Close()

	req, err := http.NewRequest("GET", "http://localhost:9090/api/destination/" + strconv.Itoa(id), nil)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, ErrDestinationNotFound
	}
	defer resp.Body.Close()

	var comments []Comment
	db.Where(&Comment{DestinationID: id}).Find(&comments)

	var forReturn Comments
	for i, _ := range comments {
		forReturn = append(forReturn, &comments[i])
	}

	return forReturn, nil
}


func AddComment(c *Comment) (*Comment, error) {
	db, err = gorm.Open("postgres", "host=host.docker.internal port=5432 user=postgres dbname=go_booking_ratings_comments sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfully connected to database!")
	}
	defer db.Close()
	db.Create(c)

	return c, nil
}
var ErrCommentNotFound = fmt.Errorf("Comment not found")
var ErrCommentCannotBeDeleted = fmt.Errorf("Comment cannot be deleted")

func GetComment(id int) (*Comment, error) {
	db, err = gorm.Open("postgres", "host=host.docker.internal port=5432 user=postgres dbname=go_booking_ratings_comments sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfully connected to database!")
	}
	defer db.Close()

	var comment Comment
	result := db.First(&comment, id)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) || result.RowsAffected == 0 {
		return nil, ErrCommentNotFound
	}

	return &comment, nil
}

func DeleteComment(id int, token string) error {
	comment, err := GetComment(id)
	if err == ErrCommentNotFound {
		return err
	}

	db, err = gorm.Open("postgres", "host=host.docker.internal port=5432 user=postgres dbname=go_booking_ratings_comments sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfully connected to database!")
	}
	defer db.Close()

	claims := jwt.MapClaims{}
	jwt.ParseWithClaims(token, claims, func(tok *jwt.Token) (interface{}, error) {
		return []byte("123456asdf"), nil
	})

	sub := claims["sub"].(map[string]interface{})
	userID := sub["id"].(float64)
	userIDint := int(userID)

	if userIDint != comment.UserID {
		return ErrCommentCannotBeDeleted
	}

	db.Delete(comment)

	return nil
}

