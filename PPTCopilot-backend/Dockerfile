# Use the official Golang image as a base image
FROM golang:1.20

# Set the working directory to /app
WORKDIR /home/app

# Copy the Go modules and sum files first to leverage Docker cache
COPY go.mod go.sum ./

# Download the necessary Go modules and install bee tool
RUN go env -w GO111MODULE=on \
    && go install github.com/beego/bee/v2@latest \
    && go mod download \
    && go mod verify

# Copy the rest of the application code
COPY . .

# Use arguments with default values for the MySQL host and port
ARG MYSQL_HOST=host.docker.internal
ARG MYSQL_PORT=3306
# Set the environment variables based on the ARG values
ENV MYSQL_HOST=${MYSQL_HOST} \
    MYSQL_PORT=${MYSQL_PORT}

# Use argument for the server IP and set a default value if not provided
ARG SERVER_IP=127.0.0.1
# Run env.py with the SERVER_IP argument
RUN if [ -z "$SERVER_IP" ] ; then python3 env.py ; else python3 env.py $SERVER_IP ; fi

# The command to run when starting the container
CMD ["bee", "run"]

