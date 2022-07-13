package data_model

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/go-playground/validator/v10"
	"github.com/jinzhu/gorm"
	"io"
	"log"
	"net/http"
	"strconv"
)

type Destination struct {
	gorm.Model

	Name        string  `json:"name" validate:"required"`
	Country string  `json:"country" validate:"required"`
	Description string  `json:"description" validate:"required"`
	AverageRate float32 `json:"average_rate"`
}


type Travel struct {
	ID          int     `json:"id"`
	DestinationId int 	`json:"destination_id" validate:"required"`
	Name        string  `json:"name" validate:"required"`
	DateTime    float64 `json:"date_time" validate:"required"`
	Price       float32 `json:"price" validate:"required,gt=0"`
	Description string  `json:"description" validate:"required"`
}
type Travels []*Travel
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

var ErrDestinationNotFound = fmt.Errorf("Destination not found")

func FindDestination(id int) (*Destination, error) {
	db, err = gorm.Open("postgres", "host=localhost port=5434 user=postgres dbname=go_booking_destinations sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfully connected to database!")
	}
	defer db.Close()

	var destination Destination
	result := db.First(&destination, id)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) || result.RowsAffected == 0 {
		return nil, ErrDestinationNotFound
	}

	return &destination, nil
}
func UpdateDestinationAverageRate(id int, average float32) error {
	destination, err := FindDestination(id)
	if err != nil {
		return err
	}

	db, err = gorm.Open("postgres", "host=localhost port=5434 user=postgres dbname=go_booking_destinations sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfuly connected to database!")
	}
	defer db.Close()

	destination.AverageRate = average

	db.Save(destination)

	return nil
}
func GetDestinations() Destionations {
	db, err = gorm.Open("postgres", "host=localhost port=5434 user=postgres dbname=go_booking_destinations sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfully connected to database!")
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
	db, err = gorm.Open("postgres", "host=localhost port=5434 user=postgres dbname=go_booking_destinations sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfuly connected to database!")
	}
	defer db.Close()
	db.Create(d)
}


func UpdateDestination(id int, d *Destination) error {
	destination, err := FindDestination(id)
	if err != nil {
		return err
	}

	db, err = gorm.Open("postgres", "host=localhost port=5434 user=postgres dbname=go_booking_destinations sslmode=disable password=12345")
	if err != nil {
		panic("failed to connect database")
	}
	defer db.Close()

	oldName := destination.Name

	destination.Name = d.Name
	destination.Description = d.Description
	destination.Country = d.Country
	destination.AverageRate = d.AverageRate


	//ako se izmeni naziv destinacije treba ga promeniti u svim putovanjima gde se pojavljivala ta destinacija
	if oldName != d.Name {
		//var bearer = "Bearer " + token
		jsonValue, _ := json.Marshal(destination)
		req, err := http.NewRequest("PUT", "http://localhost:9091/api/travels", bytes.NewBuffer(jsonValue))
		//req.Header.Add("Authorization", bearer)

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			return err
		}
		defer resp.Body.Close()
	}

	db.Save(destination)

	return nil
}


var ErrDestinationCannotBeDeleted = fmt.Errorf("Destination cannot be deleted")
func DeleteDestination(id int) error {
	destination, err := FindDestination(id)
	if err != nil {
		return err
	}

	print(destination.Name)
	db, err = gorm.Open("postgres", "host=localhost port=5434 user=postgres dbname=go_booking_destinations sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfully connected to database!")
	}
	defer db.Close()

	//var bearer = "Bearer " + token
	req, err := http.NewRequest("GET", "http://localhost:9091/api/travelsByDestination/" + strconv.Itoa(id), nil)
	////req.Header.Add("Authorization", bearer)
	//
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {

		return err
	}
	defer resp.Body.Close()

	var travels Travels

	if err := json.NewDecoder(resp.Body).Decode(&travels); err != nil {

		return err
	}


	if len(travels) != 0 {

		return ErrDestinationCannotBeDeleted
	}

	db.Delete(destination)

	return nil
}

