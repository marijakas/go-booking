package data_model

import (
	"bytes"
	"encoding/json"
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

type Rate struct {
	gorm.Model

	DestinationID     int 	`json:"destination_id" validate:"required"`
	UserID     	int 	`json:"user_id""`
	Value    	int  	`json:"value" validate:"required,gt=0,lt=6"`
}

type Destination struct {
	gorm.Model

	Name        string  `json:"name" validate:"required"`
	Country string  `json:"country" validate:"required"`
	Description string  `json:"description" validate:"required"`
	AverageRate float32 `json:"average_rate"`
}


func (rate *Rate) FromJSON(r io.Reader) error {
	e := json.NewDecoder(r)
	return e.Decode(rate)
}

func (rate *Rate) ToJSON(w io.Writer) error {
	e := json.NewEncoder(w)
	return e.Encode(rate)
}

func (rate *Rate) Validate() error {
	validate := validator.New()
	return validate.Struct(rate)
}
func (d *Destination) FromJSON(r io.Reader) error {
	e := json.NewDecoder(r)
	return e.Decode(d)
}

func (d *Destination) ToJSON(w io.Writer) error {
	e := json.NewEncoder(w)
	return e.Encode(d)
}
var db *gorm.DB
var err error


var ErrDestinationNotFound = fmt.Errorf("Destination not found")
func GetRate(id int, token string) (*Rate, error) {
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

	var destination Destination
	if err := json.NewDecoder(resp.Body).Decode(&destination); err != nil {
		return nil, ErrDestinationNotFound
	}

	claims := jwt.MapClaims{}
	jwt.ParseWithClaims(token, claims, func(tok *jwt.Token) (interface{}, error) {
		return []byte("123456asdf"), nil
	})

	sub := claims["sub"].(map[string]interface{})
	userID := sub["id"].(float64)
	userIDint := int(userID)

	var rate Rate
	db.Where(&Rate{DestinationID: id, UserID: userIDint}).Find(&rate)

	return &rate, nil
}


func AddRate(r *Rate, token string) (*Destination, error) {
	db, err = gorm.Open("postgres", "host=host.docker.internal port=5432 user=postgres dbname=go_booking_ratings_comments sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfully connected to database!")
	}
	defer db.Close()

	var bearer = "Bearer " + token
	req, err := http.NewRequest("GET", "http://localhost:9090/api/destination/" + strconv.Itoa(r.DestinationID), nil)

	req.Header.Add("Authorization", bearer)

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

	claims := jwt.MapClaims{}
	jwt.ParseWithClaims(token, claims, func(tok *jwt.Token) (interface{}, error) {
		return []byte("123456asdf"), nil
	})

	sub := claims["sub"].(map[string]interface{})
	id := sub["id"].(float64)

	r.UserID = int(id)

	var rate Rate
	result := db.Where(&Rate{DestinationID: r.DestinationID, UserID: int(id)}).Find(&rate)
	db.Create(r)
	if result.RowsAffected == 0 {
		db.Create(r)
	} else {
		rate.Value = r.Value
		db.Save(rate)
	}

	var rates []Rate
	db.Where(&Rate{DestinationID: r.DestinationID}).Find(&rates)

	var sum float32 = 0
	for _, r := range rates {
		sum = sum + float32(r.Value)

	}

	print(sum/float32(len(rates)))
	dest.AverageRate = sum/float32(len(rates))

	jsonValue, _ := json.Marshal(dest)
	putReq, err := http.NewRequest("PUT", "http://localhost:9090/api/updateDestination/" + strconv.Itoa(r.DestinationID), bytes.NewBuffer(jsonValue))

	putReq.Header.Add("Authorization", bearer)

	client = &http.Client{}
	resp, err = client.Do(putReq)
	if err != nil {
		return nil, ErrDestinationNotFound
	}
	defer resp.Body.Close()

	return &dest, nil
}

