OBJS	= Prueba.o
SOURCE	= Prueba.cpp
HEADER	= 
OUT	= run.exe
CC	 = g++

FLAGS	 = -g -c -Wall
LFLAGS	 = 

all: $(OBJS)
	$(CC) -g $(OBJS) -o $(OUT) $(LFLAGS)

Prueba.o: Prueba.cpp
	$(CC) $(FLAGS) Prueba.cpp

run:
	cls && $(OUT)
	
clean:
	del $(OBJS) $(OUT)
