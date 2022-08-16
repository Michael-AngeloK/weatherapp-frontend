*** Settings ***
Library           SeleniumLibrary

*** Test Cases ***
TestCase1
    open Browser                https://localhost:8000    Edge
    wait until page contains    Current weather in     
    close Browser