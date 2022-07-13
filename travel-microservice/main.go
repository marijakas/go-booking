package main

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	//gohandlers "github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/rs/cors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"time"
	"travel-microservice/data_model"
)

var db *gorm.DB
var err error

//main funkcija
func main() {
	db, err = gorm.Open("postgres", "host=localhost port=5437 user=postgres dbname=go_booking_travels sslmode=disable password=12345")

	//oppening connection to database
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfully connected to database!")
	}

	//closing connection to database
	defer db.Close()

	db.AutoMigrate(&data_model.Travel{})

	router := mux.NewRouter()
	router.HandleFunc("/api/getTravels", GetTravels).Methods("GET")
	router.HandleFunc("/api/addTravel", AddTravel).Methods("POST")
	router.HandleFunc("/api/travels", UpdateTravels).Methods("PUT")
	router.HandleFunc("/api/travelsByDestination/{id:[0-9]+}", GetTravelsByDestination).Methods("GET")
	router.HandleFunc("/api/travel/{id:[0-9]+}", FindTravel).Methods("GET")
	router.HandleFunc("/api/delete/{id:[0-9]+}", DeleteTravel).Methods("DELETE","GET")
	router.HandleFunc("/api/updateTravel/{id:[0-9]+}", UpdateOneTravel).Methods("PUT")

	l := log.New(os.Stdout, "destination-api ", log.LstdFlags)
	cf := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:4200"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Page", "PerPage", "Content-Type"},
		AllowCredentials: true,
		Debug:            true,
	})

	s := http.Server{
		Addr:         ":9091",           // configure the bind address
		Handler:      cf.Handler(router),     // set the default handler
		ErrorLog:     l,               // set the logger for the server
		ReadTimeout:  10 * time.Second,  // max time to read request from the client
		WriteTimeout: 20 * time.Second,  // max time to write response to the client
		IdleTimeout:  120 * time.Second, // max time for connections using TCP Keep-Alive
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
func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Credentials", "true")
	(*w).Header().Set("Content-Type", "application/json")
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Headers", "append,delete,entries,foreach,get,has,keys,set,values,Authorization")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT")
}

func UpdateOneTravel(rw http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(rw, "Unable to convert id", http.StatusBadRequest)
		return
	}
	var travel data_model.Travel
	json.NewDecoder(r.Body).Decode(&travel)



	err = data_model.UpdateOneTravel(id, &travel)

	if err == data_model.ErrTravelNotFound {
		http.Error(rw, "Travel not found", http.StatusNotFound)
		return
	}

	if err != nil {
		http.Error(rw, "Travel not found", http.StatusInternalServerError)
		return
	}
}

func GetTravels(rw http.ResponseWriter, r *http.Request) {


	lm := data_model.GetTravels()

	err := lm.ToJSON(rw)
	if err != nil {
		http.Error(rw, "Unable to marshal json", http.StatusInternalServerError)
	}
}
func FindTravel(rw http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(rw, "Unable to convert id", http.StatusBadRequest)
		return
	}

	var travel *data_model.Travel
	travel, err = data_model.FindTravel(id)
	if err == data_model.ErrTravelNotFound {
		http.Error(rw, "Destination not found", http.StatusNotFound)
		return
	}

	if err != nil {
		http.Error(rw, "Destination not found", http.StatusInternalServerError)
		return
	}

	errr := travel.ToJSON(rw)
	if errr != nil {
		http.Error(rw, "Unable to marshal json", http.StatusInternalServerError)
	}
}

func AddTravel(rw http.ResponseWriter, r *http.Request) {

	var travel data_model.Travel
	json.NewDecoder(r.Body).Decode(&travel)
	data_model.AddTravel(&travel)
}
func UpdateTravels(rw http.ResponseWriter, r *http.Request) {

	dest := data_model.Destination{}
	dest.FromJSON(r.Body)

	data_model.UpdateTravels(&dest)
}
func  GetTravelsByDestination(rw http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(rw, "Unable to convert id", http.StatusBadRequest)
		return
	}


	var travels data_model.Travels
	travels = data_model.GetTravelsByDestination(id)

	errr := travels.ToJSON(rw)
	if errr != nil {
		http.Error(rw, "Unable to marshal json", http.StatusInternalServerError)
	}
}
func  DeleteTravel(rw http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(rw, "Unable to convert id", http.StatusBadRequest)
		return
	}
	authHeader := r.Header.Get("Authorization")
	splitToken := strings.Split(authHeader, "Bearer ")
	reqToken := splitToken[1]


	err = data_model.DeleteTravel(id, reqToken)

	if err == data_model.ErrTravelCannotBeDeleted {
		http.Error(rw, "Travel not found", http.StatusNotFound)
		return
	}

}


