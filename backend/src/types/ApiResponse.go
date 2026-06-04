package types

type ApiResponse[T any] struct {
	Status  bool
	Code    uint16
	Message string
	Data    T
}
