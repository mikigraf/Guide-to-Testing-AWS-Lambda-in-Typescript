#!/bin/bash

dir=${dir:-./}
name=${name:-is out}

while [ $# -gt 0 ]; do

    if [[ $1 == *"--"* ]]; then
        param="${1/--/}"
        declare $param="$2"
        # echo $1 $2 // Optional to see the parameter:value result
    fi

    shift
done

cd $dir
mkdir $name

#/usr/bin/expect <<!

spawn npm init
expect "package name:"
send "$name\n" 
expect "version:"
send "$version\n" 
expect "description:"
send "$description\n" 
expect "entry point:"
send "$entryPoint\n" 
expect "test command:"
send "$testCommand\n" 
expect "git repository"
send "$gitRepo\n" 
expect "keywords:"
send "$keywords\n" 
expect "author:"
send "$author\n" 
expect "license:"
send "$license\n" 
expect "Is this ok?"
send "$isOkay\n"
expect eof
!
echo "DONE!"

echo $dir $name
