JFLAGS = -g
JC = javac 

.SUFFIXES: .java .class

.java.class:
	$(JC) $(JFLAGS) $*.java

CLASSES = \
        main.java 

MAINCLASS = \
		main

all: $(CLASSES:.java=.class)

run: 
	cls && python

clean:
	del $(CLASSES:.java=.class)
