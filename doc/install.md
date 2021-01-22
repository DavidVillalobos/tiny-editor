# MINGW installation

> 	Minimalist GNU for Windows: A native Windows port of the GNU Compiler Collection (GCC), with freely     
	distributable import libraries and header files for building native Windows applications    
  
	First, we need to install the Mingw available at the following site we must download mingw-get-setup.exe.    
	https://osdn.net/projects/mingw/releases/   

	Once downloaded we open the installer and follow the general steps of any installer Open -> Accept -> Continue.  
 

# G++ installation

>	G ++ is a command line compiler that compiles and links C ++ programs, generating the corresponding executable file (.exe).  
	In order to execute the G ++ compilation commands we need a console (or terminal window), which is a text mode window that   
	allows to give instructions to the operating system (OS) by executing commands by one (consoles such as cmd, powershell or   
	bash linux). The OS understands a series of default commands (dir, cd, copy, move, ...), each one with its own syntax that   
	must be respected. And as we install certain programs, more commands are added that can be executed in the console.  
	For example, after installing MinGW we can install and configure the g ++ command to compile C ++ programs.   
	The g ++ command also has its particular syntax that we must know and respect in order to write and execute the compilation   
	commands correctly.  

We start the Mingw program, it probably already starts by itself, but you can search for it in Windows as "MINGW".   
We proceed to install the C++ compiler (G++).  

	1. Select the Basic Setup category.  
	2. We mark the option of mingw32-gcc-g ++ - bin, selecting "Mark for Installation"  
	3. Select the installation tab and apply the changes.  
	4. We apply the changes, close the window and Mingw.  

# Settings

>	The programs that can be run through the console are stored in multiple locations, the system locates them through a   
path (PATH) that specifies which should be registered, these paths can be saved in variables, these are known as   
environment variables. , we must locate g ++. exe so that it can be used, and save its location in the PATH environment   
variable, which is where the locations of the programs in general are stored in order to be executed from the console.   
In addition, they can be saved depending on the current user of the computer or in general for all users of the equipment,   
as in this case we are going to do it.  
1. First, we look in the Windows search engine "Edit environment variables".  
2.	We select "Environment variables".  
3. 	We select the variable "PATH" and in "Edit ..." of the box below, the one above is the one for the current user,   
		the one below is for all users.  
4. 	Select in New and write the location of g ++. Exe  
			Expected location: C:\MinGW\bin    
5. 	Select accept in each tab that was left open.  
			In this way the system will find all the programs in the registered folder C:MinGW\bin and thus we will have   
			new commands to execute from the console.  

# Install mingw32-make

> To compile programs in c ++ it is necessary to invoke ag ++ using a series of rules. It usually becomes complicated 
  and tiring to be writing text, as a solution to this we can create a "makefile" file that is responsible for developing 
  the necessary command to compile our program with g ++, for this we need to install mingw32-make.
1.	We open Mingw, (You can look for it if you don't remember where it is)  
2.	Now we look in the tab of all packages (All Packages), the one with the name   
	mingw32-make-bin, and repeat the same steps used to install g ++ step 2, 3 and 4.   
	It is not necessary to configure the location because it is in the same folder   
	as g++ and as it was configured previously, it is not necessary to do it again.  
3. 	As a personal recommendation for ease of use, it is better to copy the 
	mingw32-make.exe program and rename the copy to "make.exe"  

This way it is easier to use it from the console.
