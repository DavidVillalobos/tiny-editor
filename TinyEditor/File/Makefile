OBJS	= main.o
SOURCE	= main.cpp
HEADER	= 
OUT	= run.exe
CC	 = g++

FLAGS	 = -g -c -Wall
LFLAGS	 = 

all: $(OBJS)
	$(CC) -g $(OBJS) -o $(OUT) $(LFLAGS)

main.o: main.cpp
	$(CC) $(FLAGS) main.cpp

clean:
	del $(OBJS) $(OUT)

run: $(OUT)
	$(OUT)