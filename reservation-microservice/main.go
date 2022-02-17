package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/rs/cors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"

	"reservation-microservice/data_model"
	"time"
)

var db *gorm.DB
var err error


func main() {
	db, err = gorm.Open("postgres", "host=localhost port=5436 user=postgres dbname=go_booking_reservations sslmode=disable password=12345")

	//oppening connection to database
	if err != nil {
		log.Fatal(err)
	} else {
		fmt.Println("Successfully connected to database!")
	}

	//closing connection to database
	defer db.Close()

	db.AutoMigrate(&data_model.Reservation{})


	router := mux.NewRouter()
	router.HandleFunc("/api/addReservation", AddReservation).Methods("POST")
	router.HandleFunc("/api/getReservations", GetReservations).Methods("GET")
	router.HandleFunc("/api/getReservationsByUser/{id:[0-9]+}", GetReservationsByUser).Methods("GET")
	router.HandleFunc("/api/deleteReservation/{id:[0-9]+}", DeleteDestination).Methods("DELETE")
	l := log.New(os.Stdout, "reservation-api ", log.LstdFlags)
	cf := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:4200"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Page", "PerPage", "Content-Type"},
		AllowCredentials: true,
		Debug:            true,
	})

	s := http.Server{
		Addr:         ":9094",           // configure the bind address
		Handler:      cf.Handler(router),     // set the default handler
		ErrorLog:     l,               // set the logger for the server
		ReadTimeout:  10 * time.Second,  // max time to read request from the client
		WriteTimeout: 20 * time.Second,  // max time to write response to the client
		IdleTimeout:  120 * time.Second, // max time for connections using TCP Keep-Alive
	}
	go func() {
		l.Println("Starting server on port 9094")

		err := s.ListenAndServe()
		if err != nil {
			l.Printf("Error starting server: %s\n", err)
			os.Exit(1)
		}
	}()

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	signal.Notify(c, os.Kill)

	sig := <-c
	log.Println("Got signal:", sig)

	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	s.Shutdown(ctx)
}

func AddReservation(rw http.ResponseWriter, r *http.Request) {

	var reservation data_model.Reservation
	json.NewDecoder(r.Body).Decode(&reservation)
	data_model.AddReservation(&reservation)
}

func GetReservations(rw http.ResponseWriter, r *http.Request) {


	lm := data_model.GetReservations()

	err := lm.ToJSON(rw)
	if err != nil {
		http.Error(rw, "Unable to marshal json", http.StatusInternalServerError)
	}
}

func  GetReservationsByUser(rw http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(rw, "Unable to convert id", http.StatusBadRequest)
		return
	}


	var reservations data_model.Reservations
	reservations = data_model.GetReservationsByUser(id)

	errr := reservations.ToJSON(rw)
	if errr != nil {
		http.Error(rw, "Unable to marshal json", http.StatusInternalServerError)
	}
}


func  DeleteDestination(rw http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(rw, "Unable to convert id", http.StatusBadRequest)
		return
	}
	//authHeader := r.Header.Get("Authorization")
	//splitToken := strings.Split(authHeader, "Bearer ")
	//reqToken := splitToken[1]


	err = data_model.DeleteReservation(id)

	if err == data_model.ErrReservationNotFound {
		http.Error(rw, "Destination not found", http.StatusNotFound)
		return
	}

}