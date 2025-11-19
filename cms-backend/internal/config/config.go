
package config

import "os"

type Config struct {
    Port     string
    MongoURI string
    DBName   string
    JWTSecret string
    LogLevel string
}

func LoadConfig() Config {
    return Config{
        Port: getEnv("PORT", "8080"),
        MongoURI: getEnv("MONGO_URI", "mongodb://localhost:27017"),
        DBName: getEnv("DB_NAME", "cmsdb"),
        JWTSecret:"ac123"   ,  // getEnv("JWT_SECRET", "replace-me-with-secret"),
        LogLevel: getEnv("LOG_LEVEL", "info"),
    }
}

func getEnv(key, fallback string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return fallback
}
