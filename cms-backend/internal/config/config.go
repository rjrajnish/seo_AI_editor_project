
package config

import "os"

type Config struct {
    Port     string
    MongoURI string
    DBName   string
    JWTSecret string
    LogLevel string
     OpenAIKey  string
       GeminiAPIKey string
}

func LoadConfig() Config {
    return Config{
        Port: getEnv("PORT", "8080"),
        MongoURI:"mongodb://localhost:27017", // getEnv("MONGO_URI", "mongodb://localhost:27017"),
        DBName:"cmsdb", // getEnv("DB_NAME", "cmsdb"),
        JWTSecret:"ac123"   ,  // getEnv("JWT_SECRET", "replace-me-with-secret"),
        LogLevel: getEnv("LOG_LEVEL", "info"),
        //    OpenAIKey:  "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", // getEnv("OPENAI_KEY", ""),
        GeminiAPIKey: "AIzaSyB1QBfOntmr2Y9LwhDvijEq___697meMUQ",
    }
}

func getEnv(key, fallback string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return fallback
}
