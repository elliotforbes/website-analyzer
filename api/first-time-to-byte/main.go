package main

import (
	"log"
	"net"
	"net/url"
	time "time"
	"github.com/aws/aws-lambda-go/lambda"
)

type Request struct {
	Url string `json:"url"`
}

type Response struct {
	Message string `json:"message"`
	Time time.Duration `json:"time"`
}

func calcTime(my_url string) time.Duration {

	u, err := url.Parse(my_url)
	if err != nil {
		log.Fatal(err)
	}

	conn, err := net.Dial("tcp", u.Hostname() + ":80")
	if err != nil {
		panic(err)
	}
	defer conn.Close()
	conn.Write([]byte("GET / HTTP/1.0\r\n\r\n"))

	start := time.Now()
	oneByte := make([]byte, 1)
	_, err = conn.Read(oneByte)
	if err != nil {
		panic(err)
	}
	log.Println("First Byte: ", time.Since(start))
	return time.Since(start)
}

func Handler(request Request) (Response, error) {
	return Response {
		Message: "success",
		Time: calcTime(request.Url),
	}, nil
}

func main() {
	lambda.Start(Handler)
}
