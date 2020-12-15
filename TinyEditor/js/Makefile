# This Template is generate with 
# https://www.nicomedes.assistedcoding.eu/#/app/makefilegen

OBJS	= main.o
SOURCE	= main.cpp
HEADER	= 
OUT	= run.exe
CC	 = g++
# C:\MinGW\bin\g++.exe
FLAGS	 = -g -c -Wall
LFLAGS	 = 

all: $(OBJS)
	$(CC) -g $(OBJS) -o $(OUT) $(LFLAGS)

main.o: main.cpp
	$(CC) $(FLAGS) main.cpp

clean:
	rm -f $(OBJS) $(OUT)

run: $(OUT)
	./$(OUT)