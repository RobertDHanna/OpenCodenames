FROM golang:alpine

ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

RUN mkdir /client
RUN mkdir /server
RUN mkdir -p /dist/data
RUN mkdir -p /dist/static-assets

RUN apk update && apk add yarn && apk add git

WORKDIR /client
COPY ./client .
RUN yarn && yarn build
RUN cp -a build/. /dist/static-assets/


WORKDIR /server
COPY ./server/go.mod .
COPY ./server/go.sum .
RUN go mod download
COPY ./server .
RUN go build -o main .
RUN cp main /dist
RUN cp data/wordlist.txt /dist/data


EXPOSE 8080

WORKDIR /dist

CMD ["main"]