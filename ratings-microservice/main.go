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
	"ratings-microservice/data_model"
	"strconv"
	"strings"
	"time"
)



var db *gorm.DB
var err error

//database name:>>> go_booking_ratings_comments

func main(){


	db, err = gorm.Open("postgres", "host=localhost port=5432 user=postgres dbname=go_booking_ratings_comments sslmode=disable password=12345")

	//oppening connection to database
	if err != nil{
		log.Fatal(err)
	}else{
		fmt.Println("Successfully connected to database!")
	}

	//closing connection to database
	defer db.Close()

	//make migrations to the databease if they have not already been created
	db.AutoMigrate(&data_model.Rate{})
	db.AutoMigrate(&data_model.Comments{})
	l := log.New(os.Stdout, "destination-api ", log.LstdFlags)

	//API routes
	router := mux.NewRouter()
	router.HandleFunc("/api/rating/{id:[0-9]+}", GetRating).Methods("GET")
	router.HandleFunc("/api/addRating", AddRate).Methods("PUT")
	router.HandleFunc("/api/addComment", AddComment).Methods("POST")
	router.HandleFunc("/api/comments/{id:[0-9]+}", GetComments).Methods("GET")
	router.HandleFunc("/api/deleteComment/{id:[0-9]+}", DeleteComment).Methods("DELETE")

	ch := gohandlers.CORS(gohandlers.AllowedOrigins([]string{"*"}))

	s := http.Server{
		Addr:         ":9092",
		Handler:      ch(router),
		ErrorLog:     l,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 20 * time.Second,
		IdleTimeout:  120 * time.Second,
	}
	go func() {
		l.Println("Starting server on port 9092")

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

func AddRate(rw http.ResponseWriter, r *http.Request) {

	var rate data_model.Rate
	json.NewDecoder(r.Body).Decode(&rate)

	authHeader := r.Header.Get("Authorization")
	splitToken := strings.Split(authHeader, "Bearer ")
	reqToken := splitToken[1]

	dest, err := data_model.AddRate(&rate, reqToken)

	if err == data_model.ErrDestinationNotFound {
		http.Error(rw, "Destination doesn't exists", http.StatusBadRequest)
		return
	}
	if err != nil {
		http.Error(rw, "Unable to add rating", http.StatusBadRequest)
		return
	}

	err = dest.ToJSON(rw)
	if err != nil {
		http.Error(rw, "Unable to marshal json", http.StatusInternalServerError)
		return
	}
}


func GetRating(rw http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	destID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(rw, "Unable to convert id", http.StatusBadRequest)
		return
	}
	authHeader := r.Header.Get("Authorization")
	splitToken := strings.Split(authHeader, "Bearer ")
	reqToken := splitToken[1]

	rate, err := data_model.GetRate(destID, reqToken)
	if err == data_model.ErrDestinationNotFound {
		http.Error(rw, "Destination doesn't exists", http.StatusBadRequest)
		return
	}

	err = rate.ToJSON(rw)
	if err != nil {
		http.Error(rw, "Unable to marshal json", http.StatusInternalServerError)
		return
	}
}


func GetComments(rw http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(rw, "Unable to convert id", http.StatusBadRequest)
		return
	}

	lc, err := data_model.GetComments(id)
	if err == data_model.ErrDestinationNotFound {
		http.Error(rw, "Movie doesn't exists", http.StatusBadRequest)
		return
	}

	err = lc.ToJSON(rw)
	if err != nil {
		http.Error(rw, "Unable to marshal json", http.StatusInternalServerError)
		return
	}
}

func AddComment(rw http.ResponseWriter, r *http.Request) {

	var comment data_model.Comment
	json.NewDecoder(r.Body).Decode(&comment)

	authHeader := r.Header.Get("Authorization")
	splitToken := strings.Split(authHeader, "Bearer ")
	reqToken := splitToken[1]

	commentForReturn, err := data_model.AddComment(&comment, reqToken)

	if err == data_model.ErrDestinationNotFound {
		http.Error(rw, "Destination doesn't exists", http.StatusBadRequest)
		return
	}
	if err != nil {
		http.Error(rw, "Unable to create comment", http.StatusBadRequest)
		return
	}

	err = commentForReturn.ToJSON(rw)
	if err != nil {
		http.Error(rw, "Unable to marshal json", http.StatusInternalServerError)
		return
	}
}



func DeleteComment(rw http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(rw, "Unable to convert id", http.StatusBadRequest)
		return
	}



	authHeader := r.Header.Get("Authorization")
	splitToken := strings.Split(authHeader, "Bearer ")
	reqToken := splitToken[1]

	err = data_model.DeleteComment(id, reqToken)
	if err == data_model.ErrCommentCannotBeDeleted {
		http.Error(rw, "You can't delete someone else's comment", http.StatusBadRequest)
		return
	}

	if err == data_model.ErrCommentNotFound {
		http.Error(rw, "Comment not found", http.StatusBadRequest)
		return
	}
}
