package data_model

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/jinzhu/gorm"
	"io"


)
type Reservation struct{
	gorm.Model

	TravelID   int	`json:"travel_id" validate:"required"`
	TravelName        string  `json:"travel_name"`
	UserID 		 int     `json:"user_id"`
	ReservationDate float64 `json:"date_time"`
	NumberOfSeats int `json:"number_of_seats"`
	Sold         bool    `json:"sold"`
}
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

type ReservationList struct {
	Reservations []Reservation `json:"reservations"`
}
type Reservations []*Reservation

func (t *Reservation) FromJSON(r io.Reader) error {
	e := json.NewDecoder(r)
	return e.Decode(t)
}

func (t *Reservation) ToJSON(w io.Writer) error {
	e := json.NewEncoder(w)
	return e.Encode(t)
}

func (t *Reservation) Validate() error {
	validate := validator.New()
	return validate.Struct(t)
}

func (t *ReservationList) FromJSON(r io.Reader) error {
	e := json.NewDecoder(r)
	return e.Decode(t)
}

func (p *Travel) FromJSON(r io.Reader) error {
	e := json.NewDecoder(r)
	return e.Decode(p)
}

func (t *Reservations) ToJSON(w io.Writer) error {
	e := json.NewEncoder(w)
	return e.Encode(t)
}

var db *gorm.DB
var err error


func AddReservation(t *Reservation) error {
	db, err = gorm.Open("postgres", "host=host.docker.internal port=5432 user=postgres dbname=go_booking_reservations sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfully connected to database!")
	}
	defer db.Close()

	req, err := http.NewRequest("GET", "http://localhost:9091/api/travel/" + strconv.Itoa(t.TravelID), nil)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfully connected to database!")
	}
	defer resp.Body.Close()

	var travel Travel
	if err := json.NewDecoder(resp.Body).Decode(&travel); err != nil {
		return err
	}

	t.TravelName = travel.Name
	db.Create(t)

	return nil
}


func GetReservations() Reservations {
	db, err = gorm.Open("postgres", "host=host.docker.internal port=5432 user=postgres dbname=go_booking_reservations sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfully connected to database!")
	}
	defer db.Close()

	var reservations []Reservation
	db.Find(&reservations)

	var forReturn Reservations
	for i, _ := range reservations {
		forReturn = append(forReturn, &reservations[i])
	}

	return forReturn
}

func GetReservationsByUser(id int) Reservations {
	db, err = gorm.Open("postgres", "host=host.docker.internal port=5432 user=postgres dbname=go_booking_reservations sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfully connected to database!")
	}
	defer db.Close()

	var reservations []Reservation

	db.Where(&Reservation{UserID: id}).Find(&reservations)

	var forReturn Reservations
	for i, _ := range reservations {
		forReturn = append(forReturn, &reservations[i])
	}

	return forReturn
}

var ErrReservationNotFound = fmt.Errorf("Reservation not found")

func DeleteReservation(id int) error {
	ticket, err := FindReservation(id)
	if err != nil {
		return ErrReservationNotFound
	}

	db, err = gorm.Open("postgres", "host=host.docker.internal port=5432 user=postgres dbname=go_booking_reservations sslmode=disable password=12345")
	 if err != nil{
		 log.Fatal(err)
	 }else{
		 fmt.Println("Successfully connected to database!")
	 }
	defer db.Close()

	db.Delete(ticket)

	return nil
}
func FindReservation(id int) (*Reservation, error) {
	db, err = gorm.Open("postgres", "host=host.docker.internal port=5432 user=postgres dbname=go_booking_reservations sslmode=disable password=12345")
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfully connected to database!")
	}
	defer db.Close()

	var reservation Reservation
	result := db.First(&reservation, id)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) || result.RowsAffected == 0 {
		return nil, ErrReservationNotFound
	}

	return &reservation, nil
}
