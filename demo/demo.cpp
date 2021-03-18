#include<iostream>
using namespace std;

int fibonacci(int lim){
    int fib = 0, aux = 1;
    for(int i = 1; i <= lim; i++){
        aux += fib;
        fib = aux - fib;
    }
    return fib;
}

int main(){
	cout << "Fibonacci(10): " << fibonacci(10) << endl;
}




