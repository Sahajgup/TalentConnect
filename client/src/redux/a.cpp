#include<bits/stdc++.h>
#define int long long
using namespace std;

int f(int n){

    if(n<0) return 1e9;
    if(n==0) return 0;


    int op1 = 1 + f(n-3);
    int op2 = 1 + f(n-4);

    return min(op1,op2);
}




int32_t main()
{
ios_base::sync_with_stdio(false);cin.tie(NULL);
int t = f(18);
cout<<t<<endl;
return 0;
}