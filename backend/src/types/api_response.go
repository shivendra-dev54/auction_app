package custom_types

type ApiResponse[T any] struct {
	Status  bool
	Code    int
	Message string
	Data    T
}