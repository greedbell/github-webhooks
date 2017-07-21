#!/bin/bash
# Author: Bell<bell@greedlab.com>

while getopts 'b:' OPT; do
    case $OPT in
        b)
            branch="$OPTARG";;
        ?)
            echo "Usage: `basename $0` [-b branch]"
    esac
done

if ! [[ ${branch} -eq master ]]
    then
        echo 'error! must be in the master branch'
        exit 0
fi

echo push ${branch} successfull
