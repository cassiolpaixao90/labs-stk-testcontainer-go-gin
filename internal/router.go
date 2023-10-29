package internal

import "github.com/gin-gonic/gin"

func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.GET("/ping-account", func(c *gin.Context) {
		c.String(200, "pong")
	})
	return r
}
