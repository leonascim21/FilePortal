package logging

import (
	"fmt"
	"os"
	"time"

	"github.com/rs/zerolog"
)

var logger zerolog.Logger

func InitializeLogger() {
	zerolog.TimeFieldFormat = time.RFC3339

	file, err := os.OpenFile("logging/logs/log.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
	if err != nil {
		//TODO: HANDLE ERRORS OPENING FILE
		fmt.Println("Failed to open log file")
	}

	logger = zerolog.New(file).With().Timestamp().Logger()
}

func LogRequest(endpoint string, entry bool) {
	if entry {
		logger.Info().
			Str("endpoint", endpoint).
			Str("event", "entry").
			Msg("Request started")
	} else {
		logger.Info().
			Str("endpoint", endpoint).
			Str("event", "exit").
			Msg("Request finished")
	}
}

func LogFileOperation() {
	logger.Info().
		//TODO: ADD LOGS INFORMATION
		//DOWNLOADED/UPLOADED/DELETED/ETC. FILE
		Msg("File operation performed")
}

func LogConnection() {
	logger.Info().
		//TODO: LOG USER CONNECTIONS/DISCONNECTIONS
		Msg("Connection event")
}

func LogCRONJob(jobName, result string) {
	logger.Info().
		Msg("CRON job performed")
}
