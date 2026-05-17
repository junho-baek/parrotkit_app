FROM golang:1.23-bookworm AS build

WORKDIR /src

COPY go.mod ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /out/reference-api ./cmd/reference-api

FROM gcr.io/distroless/static-debian12:nonroot

COPY --from=build /out/reference-api /reference-api

EXPOSE 8787
USER nonroot:nonroot

ENTRYPOINT ["/reference-api"]
