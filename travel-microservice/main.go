package main

import (
	"context"
	"encoding/json"
	"fmt"
	gohandlers "github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
	"travel-microservice/data_model"
)

var db *gorm.DB
var err error

//main funkcija
func main() {
	db, err = gorm.Open("postgres", "host=localhost port=5432 user=postgres dbname=go_booking_travels sslmode=disable password=12345")

	//oppening connection to database
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfuly connected to database!")
	}

	//closing connection to database
	defer db.Close()

	db.AutoMigrate(&data_model.Travel{})

	router := mux.NewRouter()
	router.HandleFunc("/api/addTravel", AddTravel).Methods("POST")


	l := log.New(os.Stdout, "destination-api ", log.LstdFlags)
	ch := gohandlers.CORS(gohandlers.AllowedOrigins([]string{"*"}))

	s := http.Server{
		Addr:         ":9091",
		Handler:      ch(router),
		ErrorLog:     l,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 20 * time.Second,
		IdleTimeout:  120 * time.Second,
	}
	go func() {
		l.Println("Starting server on port 9091")

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

func AddTravel(rw http.ResponseWriter, r *http.Request) {

	var travel data_model.Travel
	json.NewDecoder(r.Body).Decode(&travel)
	data_model.AddTravel(&travel)
}
