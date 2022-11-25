#! /bin/bash


ysipd keys add genesis --recover < mnemonic
ysipd tx bank send validator ysip102xnfc6d5j8j7tshq3yrg0t7kr8tsd2y242ku0 1000000ukrw -y -b block
ysipd tx ysip mintcoin 1000000000krw ysip102xnfc6d5j8j7tshq3yrg0t7kr8tsd2y242ku0 --from genesis --gas-prices 0.025ukrw -b block -y
ysipd tx wasm store contracts/token-aarch64.wasm --from genesis --gas 6271614 -b block -y
ysipd tx wasm store contracts/ico-aarch64.wasm --from genesis --gas 6271614 -b block -y
ysipd tx wasm store contracts/pair-aarch64.wasm --from genesis --gas 6271614 -b block -y