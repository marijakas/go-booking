package data_model

import (
	"encoding/json"
	"fmt"
	"github.com/go-playground/validator/v10"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"io"
	"log"
	"net/http"
	"strconv"
)

type Comment struct {
	ID          int     `json:"id"`
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
	db, err = gorm.Open("postgres", "host=localhost port=5432 user=postgres dbname=go_booking_ratings_comments sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfuly connected to database!")
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
	db, err = gorm.Open("postgres", "host=localhost port=5432 user=postgres dbname=go_booking_ratings_comments sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfuly connected to database!")
	}
	defer db.Close()

	//var bearer = "Bearer " + token
	req, err := http.NewRequest("GET", "http://localhost:9090/api/destination/" + strconv.Itoa(c.DestinationID), nil)

	//req.Header.Add("Authorization", bearer)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, ErrDestinationNotFound
	}
	defer resp.Body.Close()

	var dest Destination
	if err := json.NewDecoder(resp.Body).Decode(&dest); err != nil {
		return nil, ErrDestinationNotFound
	}

	//claims := jwt.MapClaims{}
	//jwt.ParseWithClaims(token, claims, func(tok *jwt.Token) (interface{}, error) {
	//	return []byte("UUSRHZPjPVgcIyWyGVGPp5Rj6pFaVgSg"), nil
	//})

	//sub := claims["sub"].(map[string]interface{})
	//id := sub["id"].(float64)
	//username := sub["username"].(string)

	//c.UserID = int(id)
	//c.Username = username

	c.UserID = 2
	c.Username = "username"
	db.Create(c)

	return c, nil
}



