package data_model

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/go-playground/validator/v10"
	"github.com/jinzhu/gorm"
	"io"
	"log"
)

type Destination struct {
	gorm.Model

	Name        string  `json:"name" validate:"required"`
	Country string  `json:"country" validate:"required"`
	Description string  `json:"description" validate:"required"`
	verageRate float32 `json:"average_rate"`
}


type Travel struct {
	ID          int     `json:"id"`
	DestinationId int 	`json:"destination_id" validate:"required"`
	Name        string  `json:"name" validate:"required"`
	DateTime    float64 `json:"date_time" validate:"required"`
	Price       float32 `json:"price" validate:"required,gt=0"`
	Description string  `json:"description" validate:"required"`
}

func (d *Destination) FromJSON(r io.Reader) error {
	e := json.NewDecoder(r)
	return e.Decode(d)
}

func (d *Destination) ToJSON(w io.Writer) error {
	e := json.NewEncoder(w)
	return e.Encode(d)
}
func (d *Destination) Validate() error {
	validate := validator.New()
	return validate.Struct(d)
}
type Destionations []*Destination

func (d *Destionations) ToJSON(w io.Writer) error {
	e := json.NewEncoder(w)
	return e.Encode(d)
}


var db *gorm.DB
var err error

func GetDestionations() Destionations {
	db, err = gorm.Open("postgres", "host=localhost port=5432 user=postgres dbname=go_booking_destinations sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfuly connected to database!")
	}
	defer db.Close()

	var destinations []Destination
	db.Find(&destinations)

	var forReturn Destionations
	for i, _ := range destinations {
		forReturn = append(forReturn, &destinations[i])
	}

	return forReturn
}
func AddDestination(d *Destination) {
	db, err = gorm.Open("postgres", "host=localhost port=5432 user=postgres dbname=go_booking_destinations sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfuly connected to database!")
	}
	defer db.Close()
	db.Create(d)
}
var ErrDestinationNotFound = fmt.Errorf("Destination not found")

func FindDestination(id int) (*Destination, error) {
	db, err = gorm.Open("postgres", "host=localhost port=5432 user=postgres dbname=go_booking_destinations sslmode=disable password=12345")
	if err != nil {
		panic("failed to connect database")
	}
	defer db.Close()

	var destination Destination
	result := db.First(&destination, id)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) || result.RowsAffected == 0 {
		return nil, ErrDestinationNotFound
	}

	return &destination, nil
}