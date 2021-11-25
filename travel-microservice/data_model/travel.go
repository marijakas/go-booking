package data_model


import (
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
type Travel struct {
	gorm.Model

	DestinationId int 	`json:"destination_id" validate:"required"`
	DestinationName        string  `json:"destination_name"`
	Name        string  `json:"name" validate:"required"`
	DateTime    string `json:"date_time" validate:"required"`
	Price       float32 `json:"price" validate:"required,gt=0"`
	Description string  `json:"description" validate:"required"`
	FreeSeats int `json:"free_seats" validate:"required"`
}

type Destination struct {
	gorm.Model

	Name        string  `json:"name" validate:"required"`
	Country string  `json:"country" validate:"required"`
	Description string  `json:"description" validate:"required"`
	AverageRate float32 `json:"average_rate"`
}


func (t *Travel) FromJSON(r io.Reader) error {
	e := json.NewDecoder(r)
	return e.Decode(t)
}

func (t *Travel) ToJSON(w io.Writer) error {
	e := json.NewEncoder(w)
	return e.Encode(t)
}
func (t *Travel) Validate() error {
	validate := validator.New()
	return validate.Struct(t)
}
type Travels []*Travel

func (t *Travels) ToJSON(w io.Writer) error {
	e := json.NewEncoder(w)
	return e.Encode(t)
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

func GetTravels() Travels {
	db, err = gorm.Open("postgres", "host=localhost port=5432 user=postgres dbname=go_booking_travels sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfuly connected to database!")
	}
	defer db.Close()

	var travels []Travel
	db.Find(&travels)

	var forReturn Travels
	for i, _ := range travels {
		forReturn = append(forReturn, &travels[i])
	}

	return forReturn
}

var ErrTravelNotFound = fmt.Errorf("Travel not found")

func FindTravel(id int) (*Travel, error) {
	db, err = gorm.Open("postgres", "host=localhost port=5432 user=postgres dbname=go_booking_travels sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfuly connected to database!")
	}
	defer db.Close()

	var travel Travel
	result := db.First(&travel, id)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) || result.RowsAffected == 0 {
		return nil, ErrTravelNotFound
	}

	return &travel, nil
}
func GetTravelsByDestination(id int) Travels {
	db, err = gorm.Open("postgres", "host=localhost port=5432 user=postgres dbname=go_booking_travels sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfuly connected to database!")
	}
	defer db.Close()

	var travels []Travel
	db.Where(&Travel{DestinationId: id}).Find(&travels)

	var forReturn Travels
	for i, _ := range travels {
		forReturn = append(forReturn, &travels[i])
	}

	return forReturn
}

func AddTravel(t *Travel) error {
	db, err = gorm.Open("postgres", "host=localhost port=5432 user=postgres dbname=go_booking_travels sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfuly connected to database!")
	}
	defer db.Close()

	req, err := http.NewRequest("GET", "http://localhost:9090/api/destination/" + strconv.Itoa(t.DestinationId), nil)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfuly connected to database!")
	}
	defer resp.Body.Close()

	var destination Destination
	if err := json.NewDecoder(resp.Body).Decode(&destination); err != nil {
		return err
	}

	t.DestinationName = destination.Name
	db.Create(t)

	return nil
}

func UpdateTravels(d *Destination) error {
	db, err = gorm.Open("postgres", "host=localhost port=5432 user=postgres dbname=go_booking_travels sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfuly connected to database!")
	}
	defer db.Close()

	var trvls []Travel
	db.Where(&Travel{DestinationId: int(d.ID)}).Find(&trvls)

	for _, p := range trvls {
		p.DestinationName = d.Name
		db.Save(p)
	}

	return nil
}
