#!/bin/bash

read -p "Did you export your AWS ACCOUNT_ID? (y/N): " varname

if [[ -z $varname ]] || [[ $varname == 'n' ]] || [[ $varname == 'N' ]]; then
  echo -e "\ntry with:"
  echo -e "  $ export ACCOUNT_ID=YOUR_AWS_ACCOUNT_ID"
  echo -e "Then run this script again\n"
  exit 1
fi

exit 0
