package main

import (
	"agency-microservice/data_model"
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
	"strconv"
	"time"
)

var db *gorm.DB
var err error

var (
	destinations = []data_model.Destination{
		{

			Name:        "Name1",
			Country:     "Srbija",
			Description: "desc1",
		},
		{

			Name:        "Name2",
			Country:     "Madjarska",
			Description: "Desc2",
		},
	}
)


func main(){

	db, err = gorm.Open("postgres", "host=localhost port=5432 user=postgres dbname=go_booking_destinations sslmode=disable password=12345")

	//oppening connection to database
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfuly connected to database!")
	}

	//closing connection to database
	defer db.Close()

	//make migrations to the databease if they have not already been created
	db.AutoMigrate(&data_model.Destination{})

	for idx := range destinations {
		var existingName []data_model.Destination
		result := db.Where(&data_model.Destination{Name: destinations[idx].Name}).Find(&existingName)
		if result.RowsAffected == 0 {
			db.Create(&destinations[idx])
		}
	}
	l := log.New(os.Stdout, "destination-api ", log.LstdFlags)

	//API routes
	router := mux.NewRouter()
	router.HandleFunc("/api/destinations", GetDestinations).Methods("GET")
	router.HandleFunc("/api/destination/{id:[0-9]+}", GetOneDestination).Methods("GET")
	router.HandleFunc("/api/addDestination", AddDestination).Methods("POST")
	router.HandleFunc("/api/updateDestination/{id:[0-9]+}", UpdateDestination).Methods("PUT")



	ch := gohandlers.CORS(gohandlers.AllowedOrigins([]string{"*"}))

	s := http.Server{
		Addr:         ":9090",
		Handler:      ch(router),
		ErrorLog:     l,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 20 * time.Second,
		IdleTimeout:  120 * time.Second,
	}
	go func() {
		l.Println("Starting server on port 9090")

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
func GetDestinations(rw http.ResponseWriter, r *http.Request) {


	lm := data_model.GetDestinations()

	err := lm.ToJSON(rw)
	if err != nil {
		http.Error(rw, "Unable to marshal json", http.StatusInternalServerError)
	}
}

func AddDestination(rw http.ResponseWriter, r *http.Request) {

	var destination data_model.Destination
	json.NewDecoder(r.Body).Decode(&destination)
	data_model.AddDestination(&destination)
}

func GetOneDestination(rw http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(rw, "Unable to convert id", http.StatusBadRequest)
		return
	}

	var destination *data_model.Destination
	destination, err = data_model.FindDestination(id)
	if err == data_model.ErrDestinationNotFound {
		http.Error(rw, "Destination not found", http.StatusNotFound)
		return
	}

	if err != nil {
		http.Error(rw, "Destination not found", http.StatusInternalServerError)
		return
	}

	errr := destination.ToJSON(rw)
	if errr != nil {
		http.Error(rw, "Unable to marshal json", http.StatusInternalServerError)
	}
}

func UpdateDestination(rw http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(rw, "Unable to convert id", http.StatusBadRequest)
		return
	}



	var destination data_model.Destination
	json.NewDecoder(r.Body).Decode(&destination)

	//authHeader := r.Header.Get("Authorization")
	//splitToken := strings.Split(authHeader, "Bearer ")
	//reqToken := splitToken[1]

	err = data_model.UpdateDestination(id, &destination)

	if err == data_model.ErrDestinationNotFound {
		http.Error(rw, "Destination not found", http.StatusNotFound)
		return
	}

	if err != nil {
		http.Error(rw, "Destination not found", http.StatusInternalServerError)
		return
	}
}