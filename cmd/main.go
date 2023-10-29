package main

import "labs-stk-testcontainer-go-gin/internal"

func main() {
	r := internal.SetupRouter()
	r.Run(":8090")
}
