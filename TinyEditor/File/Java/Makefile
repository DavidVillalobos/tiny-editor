
JFLAGS = -g
JC = javac 

.SUFFIXES: .java .class

.java.class:
	$(JC) $(JFLAGS) $*.java

CLASSES = \
        Prueba.java 

MAINCLASS = \
		Prueba

all: $(CLASSES:.java=.class)

run: 
	cls && java -cp . $(MAINCLASS)

clean:
	del $(CLASSES:.java=.class)
